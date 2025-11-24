import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import phoneEmailService from "../services/phoneEmailService.js";

//Token Generation
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

// Register - Create user with verified email
const register = async (req, res) => {
  try {
    const { email, age, sex, name, isEmailVerified } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in use" });
    }

    // Validate required fields
    if (!email || !name || !age || !sex) {
      return res.status(400).json({ message: "Email, name, age, and sex are required" });
    }

    // Create user (email is already verified through OTP)
    const newUser = await User.create({
      email,
      age,
      name,
      sex,
      isEmailVerified: isEmailVerified || false
    });

    const createdUser = await User.findById(newUser._id).select("-refreshToken");
    console.log("New user registered:", createdUser.email);
    
    res.status(201).json({ 
      message: "User registered successfully.", 
      user: createdUser
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Login is now REMOVED - Use verifyEmailOTPAndLogin instead
// OTP is the ONLY way to login

// Refresh
const refreshAccessToken = async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== incomingToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({ accessToken, refreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send OTP to Email
const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // For Phone.Email, the OTP is sent via their widget
    // We just return the client ID for the frontend to use
    const config = phoneEmailService.getClientId();
    
    res.status(200).json({ 
      message: "Please use Phone.Email widget to receive OTP",
      clientId: config,
      email: email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email OTP and Login
const verifyEmailOTPAndLogin = async (req, res) => {
  try {
    const { userJsonUrl } = req.body;

    console.log("OTP verification attempt with URL:", userJsonUrl);

    if (!userJsonUrl) {
      return res.status(400).json({ message: "Verification URL is required" });
    }

    // Verify OTP using Phone.Email service
    const verifiedData = await phoneEmailService.verifyEmailOTP(userJsonUrl);

    console.log("Email verified:", verifiedData.email);

    if (!verifiedData.email) {
      return res.status(400).json({ message: "Email verification failed - no email returned" });
    }

    // Find user by email (case-insensitive)
    let user = await User.findOne({ 
      email: { $regex: new RegExp(`^${verifiedData.email}$`, 'i') }
    });
    
    if (!user) {
      // New user - return flag to show signup form
      console.log("New user detected for email:", verifiedData.email);
      return res.status(200).json({ 
        userExists: false,
        email: verifiedData.email,
        message: "Please complete your registration"
      });
    }

    console.log("Existing user found:", user.email);

    // Update user verification status
    user.isEmailVerified = true;
    if (verifiedData.phoneNumber) {
      user.phoneNumber = verifiedData.phoneNumber;
      user.countryCode = verifiedData.countryCode;
      user.isPhoneVerified = true;
    }
    if (verifiedData.firstName) user.firstName = verifiedData.firstName;
    if (verifiedData.lastName) user.lastName = verifiedData.lastName;
    await user.save();

    console.log("User verification status updated");

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-refreshToken");

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    console.log("Login successful for:", user.email);

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        userExists: true,
        message: "Login successful via OTP",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ 
      message: error.message || "OTP verification failed",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

// Complete registration after user fills signup form
const completeRegistration = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Completing registration for:", user.email);

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-refreshToken");

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        message: "Registration completed successfully",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("Complete registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Phone.Email Client ID
const getPhoneEmailConfig = async (req, res) => {
  try {
    const clientId = phoneEmailService.getClientId();
    res.status(200).json({ clientId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-refreshToken");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ 
      success: true,
      data: user 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, age, sex, profilePicture } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (sex) updateData.sex = sex;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      success: true,
      message: "Profile updated successfully",
      data: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Mental Health Score
const updateMentalScore = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user._id;

    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Score must be between 0 and 100" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        mentalHealthScore: score,
        lastScoreUpdate: new Date()
      },
      { new: true }
    ).select("-refreshToken");

    res.status(200).json({ 
      message: "Mental health score updated",
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
  register, 
  refreshAccessToken, 
  logout, 
  getPhoneEmailConfig,
  sendEmailOTP,
  verifyEmailOTPAndLogin,
  completeRegistration,
  getUserProfile,
  updateUserProfile,
  updateMentalScore
};
