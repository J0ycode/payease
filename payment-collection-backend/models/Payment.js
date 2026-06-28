const mongoose = require('mongoose');

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
      min: 1,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success',
    },
    transactionId: {
      type: String,
      unique: true,
      default: () => `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
