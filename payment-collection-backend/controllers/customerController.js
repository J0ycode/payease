const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');
const { round2 } = require('../utils/money');

// GET /api/customers
// Returns the authenticated user's own account only.
// Issue #3 (IDOR): scoped to req.user.accountNumber — a user cannot enumerate other accounts.
const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({
    status: 'active',
    accountNumber: req.user.accountNumber,
  }).select('-__v');
  res.json({ success: true, count: customers.length, data: customers });
});

// GET /api/customers/:account_number
// Returns a single customer with dynamic outstanding balance.
// Issue #3 (IDOR): enforces that the caller may only access their own account.
// Issue #5: uses round2() on all monetary sums to prevent IEEE-754 float drift.
const getCustomerByAccount = asyncHandler(async (req, res) => {
  const { account_number } = req.params;

  // IDOR check — the JWT payload must match the requested account
  if (req.user.accountNumber !== account_number) {
    res.status(403);
    throw new Error('Forbidden — you can only access your own account');
  }

  const customer = await Customer.findOne({ accountNumber: account_number }).select('-__v');

  if (!customer) {
    res.status(404);
    throw new Error('Customer account not found');
  }

  // Issue #5: round2() prevents e.g. 0.1 + 0.2 + 0.3 producing 0.6000000000000001
  const payments = await Payment.find({
    accountNumber: customer.accountNumber,
    status: 'success',
  });
  const totalPaid = round2(payments.reduce((sum, p) => sum + p.paymentAmount, 0));
  const outstandingBalance = Math.max(0, round2(customer.loanAmount - totalPaid));

  const customerData = customer.toObject();
  customerData.outstandingBalance = outstandingBalance;

  res.json({ success: true, data: customerData });
});

module.exports = { getAllCustomers, getCustomerByAccount };
