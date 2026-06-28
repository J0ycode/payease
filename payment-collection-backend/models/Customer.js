const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true, // percentage e.g. 12.5
    },
    tenure: {
      type: Number,
      required: true, // in months e.g. 24
    },
    emiDue: {
      type: Number,
      required: true, // monthly EMI amount in rupees
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'defaulted'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
