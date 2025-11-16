const mongoose = require("mongoose");

const PharmacySchema = new mongoose.Schema({
  pharmacyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Pharmacy", PharmacySchema);
