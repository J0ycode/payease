/**
 * Validates the request body for POST /api/payments.
 * Ensures accountNumber and paymentAmount are present and valid.
 */
const validatePayment = (req, res, next) => {
  const { accountNumber, paymentAmount } = req.body;

  if (!accountNumber || typeof accountNumber !== 'string' || !accountNumber.trim()) {
    return res.status(400).json({
      success: false,
      message: 'accountNumber is required',
    });
  }

  const amount = Number(paymentAmount);
  if (!paymentAmount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'paymentAmount must be a positive number',
    });
  }

  // Normalize values on the request body for downstream use
  req.body.accountNumber = accountNumber.trim();
  req.body.paymentAmount = amount;

  next();
};

module.exports = { validatePayment };
