const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/payments
// Submit an EMI payment for a loan account
const makePayment = asyncHandler(async (req, res) => {
  const { accountNumber, paymentAmount } = req.body;

  // Look up the customer — validatePayment middleware already confirmed fields are present
  const customer = await Customer.findOne({ accountNumber });
  if (!customer) {
    res.status(404);
    throw new Error('Customer account not found');
  }

  if (customer.status !== 'active') {
    res.status(400);
    throw new Error(`Cannot process payment for a ${customer.status} account`);
  }

  const payment = await Payment.create({
    customerId: customer._id,
    accountNumber,
    paymentAmount,
    status: 'success',
  });

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
});

// GET /api/payments/:account_number
// Retrieve full payment history for an account, most recent first
const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    accountNumber: req.params.account_number,
  })
    .sort({ paymentDate: -1 })
    .select('-__v');

  res.json({ success: true, count: payments.length, data: payments });
});

module.exports = { makePayment, getPaymentHistory };
