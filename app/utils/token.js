const crypto = require('crypto')

const generateToken = () => {
    // Generate a random string of 128 characters
    const token = crypto.randomBytes(128).toString('hex');
  
    // Return the token
    return token;
  };


module.exports = generateToken;