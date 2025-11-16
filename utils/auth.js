const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';


function generateToken(payload){
return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // 🔥 THIS MUST EXIST
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}



module.exports = { generateToken, verifyToken };