const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/auth/login
 * Accepts { accountNumber } — issues a short-lived JWT scoped to that account.
 *
 * ⚠️  PRODUCTION NOTE: This uses account-number-only auth as a starting point.
 *     A real banking system MUST require a PIN or password.
 *     Add a `pinHash` (bcrypt) field to the Customer schema, then verify it here
 *     before issuing a token.
 */
const login = asyncHandler(async (req, res) => {
  const { accountNumber } = req.body;

  if (!accountNumber || typeof accountNumber !== 'string' || !accountNumber.trim()) {
    res.status(400);
    throw new Error('accountNumber is required');
  }

  const trimmed = accountNumber.trim().toUpperCase();

  const customer = await Customer.findOne({ accountNumber: trimmed }).select(
    '_id accountNumber customerName status'
  );

  if (!customer) {
    // Return 401 — not 404 — to avoid confirming whether an account number exists
    res.status(401);
    throw new Error('Invalid account number');
  }

  if (customer.status !== 'active') {
    res.status(403);
    throw new Error(`Account is ${customer.status} — please contact support`);
  }

  const token = jwt.sign(
    { accountNumber: customer.accountNumber, customerId: String(customer._id) },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    success: true,
    token,
    accountNumber: customer.accountNumber,
    customerName: customer.customerName,
  });
});

module.exports = { login };
