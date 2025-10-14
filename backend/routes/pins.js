const router = require("express").Router();
const Pin = require("../models/Pin");
 
router.post("/", async (req, res) => {
  console.log("POST /api/pins route hit!");
  console.log("Request body:", req.body);
  
  try {
    const newPin = new Pin(req.body);
    const savedPin = await newPin.save();
    console.log("Pin saved successfully:", savedPin);
    res.status(200).json(savedPin);
  } catch (err) {
    console.error("Error saving pin:", err);
    res.status(500).json({ error: err.message });
  }
});
 
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    console.error("Error fetching pins:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;