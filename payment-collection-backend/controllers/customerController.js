const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/customers
// Returns all active loan customers
const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ status: 'active' }).select('-__v');
  res.json({ success: true, count: customers.length, data: customers });
});

// GET /api/customers/:account_number
// Returns a single customer by account number with dynamic outstanding balance
const getCustomerByAccount = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    accountNumber: req.params.account_number,
  }).select('-__v');

  if (!customer) {
    res.status(404);
    throw new Error('Customer account not found');
  }

  // Calculate outstanding balance based on payments
  const payments = await Payment.find({
    accountNumber: customer.accountNumber,
    status: 'success',
  });
  const totalPaid = payments.reduce((sum, p) => sum + p.paymentAmount, 0);
  const outstandingBalance = Math.max(0, customer.loanAmount - totalPaid);

  const customerData = customer.toObject();
  customerData.outstandingBalance = outstandingBalance;

  res.json({ success: true, data: customerData });
});

module.exports = { getAllCustomers, getCustomerByAccount };
