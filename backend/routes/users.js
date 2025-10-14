const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
 
router.post("/register", async (req, res) => {
  try { 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
 
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    console.log(err);
     
    if (err.code === 11000) {
      if (err.keyPattern.username) {
        return res.status(400).json("Username already exists");
      }
      if (err.keyPattern.email) {
        return res.status(400).json("Email already exists");
      }
    }
    
    res.status(500).json("Something went wrong");
  }
});
 
router.post("/login", async (req, res) => {
  try {
  
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("Wrong username or password");
    }
 
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("Wrong username or password");
    }
 
    res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;