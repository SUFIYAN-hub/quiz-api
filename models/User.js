const mongoose = require("mongoose");

// This defines what a User looks like in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,        // no two users with same email
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  }
}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("User", userSchema);