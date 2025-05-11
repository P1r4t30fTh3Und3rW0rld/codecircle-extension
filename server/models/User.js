const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  leetcodeUsername: { type: String, required: true, unique: true },
  _id: { type: Number, required: true, unique: true }, // Removed potential index specification
  groups: [String], // Group names or IDs
});

module.exports = mongoose.model("User", userSchema);