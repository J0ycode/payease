// Issue #7: Whitelist — only 3-20 uppercase letters/digits are valid account numbers.
// Rejects empty strings, special characters, operators, and oversized inputs.
const ACCOUNT_NUMBER_REGEX = /^[A-Z0-9]{3,20}$/;

/**
 * Validates the request body for POST /api/payments.
 * Issue #7:  Strict regex + length limits on accountNumber.
 * Issue #14: paymentAmount is rounded to exactly 2 decimal places before storage
 *            to prevent precision drift in accounting reconciliation.
 */
const validatePayment = (req, res, next) => {
  const { accountNumber, paymentAmount } = req.body;

  if (
    !accountNumber ||
    typeof accountNumber !== 'string' ||
    !ACCOUNT_NUMBER_REGEX.test(accountNumber.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: 'accountNumber must be 3–20 uppercase alphanumeric characters (e.g. ACC001)',
    });
  }

  const raw = Number(paymentAmount);
  if (!paymentAmount || isNaN(raw) || raw <= 0 || raw > 10_000_000) {
    return res.status(400).json({
      success: false,
      message: 'paymentAmount must be a positive number not exceeding ₹1,00,00,000',
    });
  }

  // Issue #14: Round to 2 decimal places — prevents storing 1234.56789 in the DB
  req.body.accountNumber = accountNumber.trim();
  req.body.paymentAmount = Math.round(raw * 100) / 100;

  next();
};

module.exports = { validatePayment };
