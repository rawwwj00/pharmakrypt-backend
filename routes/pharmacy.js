const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/auth");
const { scanMedicine } = require("../controllers/pharmacyController");

// LOGIN ROUTE (already exists in your file)
const { loginPharmacy } = require("../controllers/pharmacyAuthController");
router.post("/auth/login", loginPharmacy);

// SCAN ROUTE
router.post("/scan", verifyToken, scanMedicine);

module.exports = router;
