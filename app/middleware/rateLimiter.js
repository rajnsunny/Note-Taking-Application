const rateLimit = require('express-rate-limit');


const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 100, // Maximum 100 requests per window
    message: 'Too many requests, please try again later.',
  });

module.exports = rateLimiter;