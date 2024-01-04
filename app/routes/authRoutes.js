const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Adjust path as needed
const authMiddleware = require('../middleware/authMiddleware');


// Registration route (password hashing)
router.route('/register')
    .post(authController.register);

router.route('/login')
    .post(authController.login); // Login route (token generation, expiration, refresh tokens)


router.route('/refresh')
    .post(authMiddleware, authController.refresh);



// Example protected endpoint (replace with your protected routes)
router.route('/profile')
    .get(authMiddleware,authController.profile);
module.exports = router;
