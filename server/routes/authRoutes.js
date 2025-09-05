const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Import middleware correctly
const auth = require('../middleware/authMiddleware'); // you already have this

    // Signup route
router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    
    const { name, email, password, username, age, sex } = req.body;

    if (!name || !email || !password || !username || !age || !sex) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      email, 
      password: hashed, 
      username, 
      age, 
      sex 
    });

    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        username: user.username,
        age: user.age,
        sex: user.sex
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    // Find the user by either email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '7d',
});

res.json({ 
  success: true,
  token, 
  user: { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    username: user.username,
    age: user.age,
    sex: user.sex,
    profilePicture: user.profilePicture || null // optional
  } 
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});
// Get current user (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Profile route (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    // Fetch full user from DB excluding password
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
