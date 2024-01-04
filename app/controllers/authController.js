const User = require('../models/user'); // Assuming your user model is named User
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');

exports.register = async (req, res) => {
  try {
    const { username , email, password } = req.body;

    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(400).json({ message: 'UserName already exists' });
    }
    // Validate user input (e.g., email format, password strength)
    // ...

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({username: username,email:  email, password: hashedPassword });
    await user.save();

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.profile = async (req, res) => {
  try {
    res.json({ user: req.user }); // Access user information from middleware
    console.log(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
};



exports.refresh = async (req, res) => {
        try {
          const token = req.header('Authorization').split(' ')[1];
          if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
      
          jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: 'Invalid token' });
            }
      
            const newAccessToken = jwt.sign({ userId: decoded.userId }, config.jwtSecret, { expiresIn: '1h' });
            res.json({ accessToken: newAccessToken });
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Refresh failed' });
        }
      }
