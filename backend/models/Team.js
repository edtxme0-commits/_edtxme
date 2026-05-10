const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
  isFounder: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
