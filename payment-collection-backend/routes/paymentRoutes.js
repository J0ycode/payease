const express = require('express');
const router = express.Router();
const { validatePayment } = require('../middleware/validateMiddleware');
const { makePayment, getPaymentHistory } = require('../controllers/paymentController');

// POST /api/payments                      — Submit an EMI payment
// GET  /api/payments/:account_number      — Payment history for an account
router.post('/', validatePayment, makePayment);
router.get('/:account_number', getPaymentHistory);

module.exports = router;
