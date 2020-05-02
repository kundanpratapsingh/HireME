const mongoose = require("mongoose");

const UserScema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: false,
  },
  password: {
    required: true,
    type: String,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserScema);
