const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerByAccount } = require('../controllers/customerController');

// GET /api/customers         — All active customers
// GET /api/customers/:account_number  — Single customer by account number
router.get('/', getAllCustomers);
router.get('/:account_number', getCustomerByAccount);

module.exports = router;
