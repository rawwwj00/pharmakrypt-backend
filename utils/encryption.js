const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY || "pharmakrypt_secret_key_12345";
const ALGO = "aes-256-cbc";

// -----------------------------
// ENCRYPT
// -----------------------------
exports.encryptToken = (text) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGO,
      crypto.createHash("sha256").update(SECRET_KEY).digest(),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  } catch (err) {
    console.error("Encryption error:", err);
    return null;
  }
};

// -----------------------------
// DECRYPT
// -----------------------------
exports.decryptToken = (data) => {
  try {
    const [ivHex, encrypted] = data.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
      ALGO,
      crypto.createHash("sha256").update(SECRET_KEY).digest(),
      iv
    );

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
};
