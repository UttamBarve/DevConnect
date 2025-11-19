const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    type: String,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 30,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
  },
  gender: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: string,
    default: " ",
  },
  about: {
    type: string,
    default: "",
  },
  skiils: {
    type: [string]
  }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
