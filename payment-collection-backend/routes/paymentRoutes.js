const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { validatePayment } = require('../middleware/validateMiddleware');
const { makePayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Issue #9: Strict per-endpoint rate limit on payment submissions.
// Max 5 payment attempts per minute per IP — stops flooding and brute-force replay.
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Payment rate limit exceeded — try again in a minute.' },
});

// POST /api/payments                 — Submit an EMI payment (auth + rate-limited + validated)
// GET  /api/payments/:account_number — Payment history for an account (auth only)
router.post('/', protect, paymentLimiter, validatePayment, makePayment);
router.get('/:account_number', protect, getPaymentHistory);

module.exports = router;
