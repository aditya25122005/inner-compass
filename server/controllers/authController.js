// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, name, age, sex } = req.body;

    // check existing user by email OR username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      name,
      age,
      sex
    });

    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // find user by email OR username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        age: user.age,
        sex: user.sex
      }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
