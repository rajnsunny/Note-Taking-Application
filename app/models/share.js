const mongoose = require('mongoose');

const ShareSchema = new mongoose.Schema({
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    // Define recipient type based on your sharing model (email, username, user reference)
    // Example:
    type: String, // Adjust as needed
    
  },
  shareType: {
    type: String,
    enum: ['public', 'private'],
    required: true,
  },
  expirationDate: {
    type: Date, // Optional for temporary sharing
  },
  token: {
    type: String, // Unique token for sharing
    required: true,
  },
});

module.exports = mongoose.model('Share', ShareSchema);
