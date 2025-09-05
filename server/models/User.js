const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
  sex: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
