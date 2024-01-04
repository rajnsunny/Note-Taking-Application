const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  TextIndex: {
    type: mongoose.Schema.Types.String,
    index: true,
  },
});


NoteSchema.index({ title: 'text', content: 'text' });

// Virtual populate the textIndex field
NoteSchema.virtual('textIndex').get(function() {
    return `${this.title} ${this.content}`;
  });
  
  // Pre-save middleware to populate the textIndex field
NoteSchema.pre('save', async function(next) {
    this.textIndex = `${this.title} ${this.content}`;
    next();
  });

 

module.exports = mongoose.model('Note', NoteSchema);
