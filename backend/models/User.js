const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  dob: { type: Date },
  profilePicture: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }],
  otpCode: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
