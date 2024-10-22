const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  }
}, { timestamps: true });

const User = mongoose.model('users', userSchema);
module.exports = User;