const Note = require('../models/note');
var mongoose = require('mongoose');


exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user.userId });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving notes' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user  = new  mongoose.Types.ObjectId(req.user.userId);

   
    const newNote = new Note({ title, content, owner: user });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating note' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
   // const noteId = new mongoose.Types.ObjectId(req.params.noteId);
  // console.log(req.params);
    const note = await Note.findByIdAndUpdate(
        req.params.noteId,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting note' });
  }
};


exports.searchNotes = async (req, res) => {
    try {
      const query = req.query.q;
      
   // console.log(query);
      // Construct the search query based on search type
      let searchQuery = {};
      if (query.startsWith('"')) {
        // Exact phrase search
        searchQuery = { $text: { $search: query } };
        
      } else if (query.endsWith('~')) {
        // Fuzzy search
        searchQuery = { $text: { $search: query.slice(0, -1) } };
        
      } else {
        // Keyword or full-text search
        searchQuery = { $text: { $search: query } };
        
      }
      console.log(searchQuery);
      const notes = await Note.find(searchQuery)
        .where('owner', req.user.userId) // Filter by authenticated user
        .select('-textIndex'); // Exclude textIndex for efficiency
  
      res.json(notes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error searching notes' });
    }
  };
  