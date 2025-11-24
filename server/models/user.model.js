import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  phoneNumber: { type: String },
  countryCode: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  refreshToken: { type: String },
  profilePicture: { type: String, default: '' }, // Store base64 or URL
  mentalHealthScore: { type: Number, default: 50 }, // Initial score
  lastScoreUpdate: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id, // refresh token mai kam information raheti hai
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
const User = mongoose.model("User", userSchema);

export default User;