const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notesController'); // Adjust path as needed
const sharingController = require('../controllers/sharingController'); // For sharing routes
const authMiddleware = require('../middleware/authMiddleware'); // Protect routes

// Core note routes
router.route('/')
  .get(authMiddleware, noteController.getAllNotes) // Protected
  .post(authMiddleware, noteController.createNote); // Protected

router.route('/:noteId')
  .get(authMiddleware, noteController.getNoteById) // Protected
  .put(authMiddleware, noteController.updateNote) // Protected
  .delete(authMiddleware, noteController.deleteNote); // Protected

// Sharing routes
router.route('/:shareId/share')
  .post(authMiddleware, sharingController.createShare) // Create/share a note
  .get(authMiddleware,sharingController.getShareById) // Get info about a shared note
  .put(authMiddleware, sharingController.updateShare) // Update sharing settings
  .delete(authMiddleware, sharingController.deleteShare); // Delete a share link

module.exports = router;
