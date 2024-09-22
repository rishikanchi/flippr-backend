const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedBooks: {
    type: [String], // or whatever type you expect (e.g., String for book URLs)
    default: [], // Set default to an empty array
  },
});

module.exports = mongoose.model('User', UserSchema);
