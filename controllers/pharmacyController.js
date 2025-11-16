const Medicine = require("../models/Medicine");
const Alert = require("../models/Alert");
const Pharmacy = require("../models/Pharmacy");
const { decrypt } = require("../utils/crypto");

exports.scanMedicine = async (req, res) => {
  try {
    const { encryptedToken, pharmacyId, pharmacyName, pharmacyLocation } = req.body;

    if (!encryptedToken) {
      return res.status(400).json({ status: "error", message: "QR data missing." });
    }

    const scanningPharmacy =
      (await Pharmacy.findOne({ pharmacyId })) || {
        pharmacyId: "Unknown",
        name: pharmacyName || "Unknown Pharmacy",
        address: pharmacyLocation || "Unknown Location"
      };

    // 🔥 DECRYPT USING CORRECT FUNCTION
    const decrypted = decrypt(encryptedToken);
    if (!decrypted) {
      return res.status(400).json({ status: "error", message: "Invalid token." });
    }

    const { medicineId, secret } = JSON.parse(decrypted);

    const med = await Medicine.findOne({ medicineId });

    if (!med) {
      return res.status(404).json({ status: "error", message: "Medicine not found." });
    }

    // FIRST SCAN
    if (!med.firstScan) {
      med.firstScan = true;
      med.scannedAt = new Date();
      med.scannedByPharmacy = scanningPharmacy.name;
      med.scannedByLocation = scanningPharmacy.address;
      await med.save();

      return res.json({
        status: "authentic",
        medicine: {
          medicineId: med.medicineId,
          name: med.name,
          manufacturer: med.manufacturer
        }
      });
    }

    // COUNTERFEIT
    const alert = await Alert.create({
      medicineId: med.medicineId,
      originalPharmacy: med.scannedByPharmacy,
      originalLocation: med.scannedByLocation,
      attemptedPharmacy: scanningPharmacy.name,
      attemptedLocation: scanningPharmacy.address,
      reportedAt: new Date()
    });

    return res.json({ status: "counterfeit", alert });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res.status(500).json({ status: "error", message: "Server crash." });
  }
};
