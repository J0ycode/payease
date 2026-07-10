const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');
const { round2 } = require('../utils/money');

// POST /api/payments
// Submit an EMI payment for a loan account.
// Issue #3 (IDOR):    Caller may only pay against their own account.
// Issue #4 (atomic):  Wrapped in a MongoDB session transaction — prevents race-condition
//                     double-spend where two concurrent requests both pass the active check.
// Issue #5 (float):   All monetary sums use round2() to avoid IEEE-754 drift.
const makePayment = asyncHandler(async (req, res) => {
  const { accountNumber, paymentAmount } = req.body;

  // Issue #3 — IDOR guard
  if (req.user.accountNumber !== accountNumber) {
    res.status(403);
    throw new Error('Forbidden — you can only make payments for your own account');
  }

  // Issue #4 — open a session and start a transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const customer = await Customer.findOne({ accountNumber }).session(session);
    if (!customer) {
      await session.abortTransaction();
      res.status(404);
      throw new Error('Customer account not found');
    }

    if (customer.status !== 'active') {
      await session.abortTransaction();
      res.status(400);
      throw new Error(`Cannot process payment for a ${customer.status} account`);
    }

    // Overpayment guard — computed inside the transaction so concurrent requests
    // cannot both pass this check for the same account simultaneously.
    const priorPayments = await Payment.find({
      accountNumber,
      status: 'success',
    }).session(session);

    const totalPaid = round2(priorPayments.reduce((sum, p) => sum + p.paymentAmount, 0));
    const outstanding = Math.max(0, round2(customer.loanAmount - totalPaid));

    // +0.01 tolerance for 2dp rounding at loan completion
    if (paymentAmount > outstanding + 0.01) {
      await session.abortTransaction();
      res.status(400);
      throw new Error(
        `Payment of ₹${paymentAmount} exceeds outstanding balance of ₹${outstanding}`
      );
    }

    const [payment] = await Payment.create(
      [{ customerId: customer._id, accountNumber, paymentAmount, status: 'success' }],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Payment successful',
      data: {
        transactionId: payment.transactionId,
        accountNumber: payment.accountNumber,
        paymentAmount: payment.paymentAmount,
        paymentDate: payment.paymentDate,
        status: payment.status,
      },
    });
  } catch (err) {
    // Abort only if the transaction is still open (commit may have already succeeded)
    if (session.inTransaction()) await session.abortTransaction();
    throw err; // Re-throw for asyncHandler → errorHandler
  } finally {
    session.endSession();
  }
});

// GET /api/payments/:account_number
// Retrieve full payment history for an account, most recent first.
// Issue #3 (IDOR):  Caller may only view their own account's history.
// Issue #11 (404):  Returns 404 for unknown accounts instead of empty 200.
const getPaymentHistory = asyncHandler(async (req, res) => {
  const { account_number } = req.params;

  // Issue #3 — IDOR guard
  if (req.user.accountNumber !== account_number) {
    res.status(403);
    throw new Error('Forbidden — you can only view your own payment history');
  }

  // Issue #11 — confirm account exists before returning (prevents 200 for unknown accounts)
  const customer = await Customer.findOne({ accountNumber: account_number });
  if (!customer) {
    res.status(404);
    throw new Error('Customer account not found');
  }

  const payments = await Payment.find({ accountNumber: account_number })
    .sort({ paymentDate: -1 })
    .select('-__v');

  res.json({ success: true, count: payments.length, data: payments });
});

module.exports = { makePayment, getPaymentHistory };
