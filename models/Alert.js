const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  medicineId: { type: String, required: true },
  originalPharmacy: { type: String, required: true },
  originalLocation: { type: String, default: null },
  attemptedPharmacy: { type: String, required: true },
  attemptedLocation: { type: String, default: null },
  note: { type: String },
  reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", AlertSchema);
