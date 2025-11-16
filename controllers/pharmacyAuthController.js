const Pharmacy = require("../models/Pharmacy");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/auth");

exports.loginPharmacy = async (req, res) => {
  try {
    const { pharmacyId, password } = req.body;

    const pharmacy = await Pharmacy.findOne({ pharmacyId });
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found" });

    const match = await bcrypt.compare(password, pharmacy.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken({
      pharmacyId: pharmacy.pharmacyId,
      role: "pharmacy"
    });

    return res.json({
      token,
      pharmacy: {
        pharmacyId: pharmacy.pharmacyId,
        name: pharmacy.name,
        address: pharmacy.address
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
