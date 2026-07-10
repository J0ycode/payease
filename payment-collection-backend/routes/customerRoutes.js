const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerByAccount } = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

// All customer routes require a valid JWT — Issue #3
// GET /api/customers               — returns the caller's own account only
// GET /api/customers/:account_number — single customer (IDOR-checked inside controller)
router.get('/', protect, getAllCustomers);
router.get('/:account_number', protect, getCustomerByAccount);

module.exports = router;
