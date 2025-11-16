const Pharmacy = require("../models/Pharmacy");
const bcrypt = require("bcryptjs");

exports.createPharmacy = async (req, res) => {
  try {
    const { pharmacyId, name, address, password } = req.body;

    if (!pharmacyId || !name || !address || !password)
      return res.status(400).json({ message: "Missing fields" });

    // ensure only admin can do this
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const exists = await Pharmacy.findOne({ pharmacyId });
    if (exists)
      return res.status(400).json({ message: "Pharmacy already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const pharmacy = new Pharmacy({
      pharmacyId,
      name,
      address,
      passwordHash,
    });

    await pharmacy.save();

    return res.json({
      message: "Pharmacy created successfully",
      pharmacy: {
        pharmacyId,
        name,
        address,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
