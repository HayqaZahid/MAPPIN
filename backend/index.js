const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");
const cors = require("cors");
dotenv.config();

app.use(express.json());
app.use(cors());

// Cache the DB connection across serverless invocations
let isConnected = false;
app.use(async (req, res, next) => {
  if (isConnected) return next();
  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("MongoDB connected!");
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

// Only listen locally — on Vercel this file is imported, not run directly
if (require.main === module) {
  app.listen(8800, () => {
    console.log("Backend server is running!");
  });
}

module.exports = app;
