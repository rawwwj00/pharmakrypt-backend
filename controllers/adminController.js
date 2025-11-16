const Medicine = require("../models/Medicine");
const Alert = require("../models/Alert");
const { encrypt } = require("../utils/crypto");
const crypto = require("crypto");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

async function createMedicine(req, res) {
  try {
    const { medicineId, name, manufacturer } = req.body;

    if (!medicineId || !name || !manufacturer) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Generate secret
    const secret = crypto.randomBytes(8).toString("hex");

    // Prepare encrypted payload
    const payload = JSON.stringify({ medicineId, secret });
    const encryptedToken = encrypt(payload);

    // Save medicine
    const med = new Medicine({
      medicineId,
      name,
      manufacturer,
      secret,
      encryptedToken,
    });

    await med.save();

    // ---- QR CODE GENERATION ----
    const qrDir = path.join(__dirname, "..", "qrcodes");
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir);

    const qrPath = path.join(qrDir, `${medicineId}.png`);

    await QRCode.toFile(qrPath, encryptedToken, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: "H",
    });

    console.log("QR generated:", qrPath);

    return res.json({
      ok: true,
      medicine: med,
      qrPath: `/qrcodes/${medicineId}.png`,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
}

async function listMedicines(req, res) {
  const meds = await Medicine.find().sort({ createdAt: -1 }).lean();
  return res.json({ meds });
}

async function listAlerts(req, res) {
  const alerts = await Alert.find().sort({ reportedAt: -1 }).lean();
  return res.json({ alerts });
}

module.exports = { createMedicine, listMedicines, listAlerts };
