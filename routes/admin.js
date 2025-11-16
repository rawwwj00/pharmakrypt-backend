const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { generateToken, verifyToken } = require("../utils/auth");
const Pharmacy = require("../models/Pharmacy");
const Medicine = require("../models/Medicine");
const Alert = require("../models/Alert");
const { createPharmacy } = require("../controllers/adminPharmacyController");


// -----------------------------------
// ADMIN LOGIN
// -----------------------------------
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const ADMIN_PW = process.env.ADMIN_PW || "adminpw";

  if (username === "admin" && password === ADMIN_PW) {
    return res.json({
      token: generateToken({
        username: "admin",
        role: "admin"
      })
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});


// -----------------------------------
// CREATE MEDICINE
// -----------------------------------
router.post('/create-medicine', verifyToken, adminController.createMedicine);


// -----------------------------------
// LIST MEDICINES (WITH CREDENTIAL)
// -----------------------------------
router.get('/medicines', verifyToken, async (req, res) => {
  const meds = await Medicine.find().lean();

  const cleaned = meds.map(m => ({
    _id: m._id,
    medicineId: m.medicineId,
    name: m.name,
    manufacturer: m.manufacturer,
    encryptedToken: m.encryptedToken || null,
    firstScan: m.firstScan || false,
    scannedAt: m.scannedAt || null,
    scannedByPharmacy: m.scannedByPharmacy || null,
    scannedByLocation: m.scannedByLocation || null

  }));

  res.json({ meds: cleaned });
});


// -----------------------------------
// LIST ALERTS (FULL DETAILS)
// -----------------------------------
router.get('/alerts', verifyToken, async (req, res) => {
  const alerts = await Alert.find().sort({ reportedAt: -1 }).lean();

  const formatted = alerts.map(a => ({
    _id: a._id,
    medicineId: a.medicineId,
    originalPharmacy: a.originalPharmacy,
    originalLocation: a.originalLocation || "Unknown",
    attemptedPharmacy: a.attemptedPharmacy,
    attemptedLocation: a.attemptedLocation || "Unknown",
    reportedAt: a.reportedAt,
    note: a.note || null
  }));

  res.json({ alerts: formatted });
});


// -----------------------------------
// LIST PHARMACIES
// -----------------------------------
router.get("/pharmacies", verifyToken, async (req, res) => {
  const rows = await Pharmacy.find().lean();
  res.json({ pharmacies: rows });
});


// -----------------------------------
// DELETE PHARMACY
// -----------------------------------
router.delete("/pharmacies/:id", verifyToken, async (req, res) => {
  try {
    await Pharmacy.findByIdAndDelete(req.params.id);
    res.json({ message: "Pharmacy removed" });
  } catch (err) {
    console.error("delete pharmacy:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// -----------------------------------
// DELETE MEDICINE
// -----------------------------------
router.delete("/medicines/:id", verifyToken, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine removed" });
  } catch (err) {
    console.error("delete medicine:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------
// DELETE ALERTS
// -----------------------------------
router.delete("/alerts/:id", verifyToken, async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: "Alert removed" });
  } catch (err) {
    console.error("delete alert:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// -----------------------------------
// CREATE PHARMACY
// -----------------------------------
router.post('/create-pharmacy', verifyToken, createPharmacy);


module.exports = router;
