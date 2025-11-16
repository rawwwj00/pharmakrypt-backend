const mongoose = require('mongoose');


const MedicineSchema = new mongoose.Schema({
medicineId: { type: String, required: true, unique: true },
name: { type: String, required: true },
manufacturer: { type: String, required: true },
secret: { type: String, required: true }, // raw secret (in prod you may hash)
encryptedToken: { type: String, required: true },
firstScan: { type: Boolean, default: false },
scannedAt: { type: Date, default: null },
scannedByPharmacy: { type: String, default: null },
scannedByLocation: { type: String, default: null },

}, { timestamps: true });


module.exports = mongoose.model('Medicine', MedicineSchema);