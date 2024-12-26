const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  quoteName: { type: String, required: true },
  customerName: { type: String, required: true },
  quoteType: { type: String, enum: ['NEW', 'USED'], required: true },
  serialNumber: { type: String },
  planNumber: { type: String },
  warrantyTerms: { type: String, enum: ['12', '24', '36'], required: true },
  warrantyHours: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Quote', QuoteSchema);
