// backend/scripts/generate-qr.js
// Usage: node generate-qr.js "<encryptedToken>" output.png
const QRCode = require('qrcode');
const fs = require('fs');

async function gen(encryptedToken, outPath) {
  try {
    const opts = { type: 'png', errorCorrectionLevel: 'H', margin: 2, width: 400 };
    const buffer = await QRCode.toBuffer(encryptedToken, opts);
    fs.writeFileSync(outPath, buffer);
    console.log('QR written to', outPath);
  } catch (e) {
    console.error('QR error', e);
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node generate-qr.js "<encryptedToken>" output.png');
  process.exit(1);
}
gen(args[0], args[1]);
