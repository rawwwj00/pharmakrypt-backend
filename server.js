const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = require("./config/db");

// ROUTES
const adminRoutes = require("./routes/admin");
const pharmacyRoutes = require("./routes/pharmacy");   // 🔥 FIXED

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDb();

// ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/pharmacy", pharmacyRoutes);  // 🔥 FIXED

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
