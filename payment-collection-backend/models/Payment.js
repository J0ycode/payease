const mongoose = require('mongoose');
const { randomBytes } = require('crypto');

const paymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    accountNumber: {
      type: String,
      required: true,
      index: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentAmount: {
      type: Number,
      required: true,
      min: 0.01, // ₹0.01 minimum
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success',
    },
    // Issue #6: replaced Date.now() + Math.random()*1000 (1-in-1000 collision risk at 1ms)
    //           with 8 bytes (2^64 values) of cryptographically random hex — collision-proof.
    transactionId: {
      type: String,
      unique: true,
      default: () =>
        `TXN${Date.now()}${randomBytes(8).toString('hex').toUpperCase()}`,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
