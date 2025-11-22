import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

// ------------------- Token Generation -------------------
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error generating tokens");
  }
};

// ------------------- Register -------------------
const register = async (req, res) => {
  try {
    const { username, email, password, age, sex, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      age,
      name,
      sex,
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user: createdUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------- Login -------------------
const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Login with username or email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid username/email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid username/email or password" });
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const userWithoutPassword = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------- Update Profile -------------------
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, age, sex } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Update fields
  user.name = name || user.name;
  user.age = age || user.age;
  user.sex = sex || user.sex;

  const updatedUser = await user.save();

  const userToReturn = await User.findById(updatedUser._id).select(
    "-password -refreshToken"
  );

  res.status(200).json({
    message: "Profile updated successfully",
    user: userToReturn,
  });
});

// ------------------- UPLOAD PROFILE IMAGE -------------------
const uploadProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  // REAL IMAGE URL (served from /uploads)
  // const imageUrl = `http://localhost:8000/${req.file.path}`;
  const imageUrl = `${process.env.BASE_URL}/${req.file.path}`;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  user.profileImageUrl = imageUrl;
  await user.save();

  res.status(200).json({
    message: "Image uploaded successfully",
    profileImageUrl: imageUrl,
  });
});

// ------------------- Refresh Token -------------------
const refreshAccessToken = async (req, res) => {
  try {
    const incomingToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== incomingToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// ------------------- Logout -------------------
const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  register,
  login,
  refreshAccessToken,
  logout,
  updateProfile,
  uploadProfileImage,
};
