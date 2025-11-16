const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();


const ENC_KEY = process.env.ENC_KEY; // hex string -> 32 bytes
const ENC_IV = process.env.ENC_IV; // hex string -> 16 bytes


if (!ENC_KEY || !ENC_IV) {
console.warn('Warning: ENC_KEY or ENC_IV not set in env — encryption will fail');
}


function encrypt(text){
const key = Buffer.from(ENC_KEY, 'hex');
const iv = Buffer.from(ENC_IV, 'hex');
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let encrypted = cipher.update(text, 'utf8', 'base64');
encrypted += cipher.final('base64');
return encrypted;
}


function decrypt(enc){
const key = Buffer.from(ENC_KEY, 'hex');
const iv = Buffer.from(ENC_IV, 'hex');
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
let out = decipher.update(enc, 'base64', 'utf8');
out += decipher.final('utf8');
return out;
}


module.exports = { encrypt, decrypt };