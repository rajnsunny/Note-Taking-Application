const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, noteController.searchNotes);

module.exports = router;
