const Note = require('../models/note');
const Share = require('../models/share');
const  generateToken  = require('../utils/token'); // Assuming a token generation function

exports.createShare = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const newShare = new Share({
      note: note._id,
      owner: req.user.userId,
      recipient: req.body.recipient || null , 
      shareType: (req.body.recipient == null) ? 'public' : 'private',
      expirationDate: req.body.expirationDate || null,
      token: generateToken(),
    });

    await newShare.save();

    // Send notification if applicable

    res.status(201).json(newShare);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sharing note' });
  }
};

exports.getShareById = async (req, res) => {
  try {
    const share = await Share.findById(req.params.shareId);
   // console.log(share);
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    // Check authorization based on recipient or token if applicable
  //  console.log(req.user);
    if(share.recipient != null || share.recipient === req.user.userId || req.user.userId == null){
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const note = await Note.findById(share.note);
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving share' });
  }
};

exports.updateShare = async (req, res) => {
  try {
    const share = await Share.findByIdAndUpdate(
      req.params.shareId,
      { ...req.body },
      { new: true }
    );

    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    // Check authorization to modify the share

    res.json(share);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating share' });
  }
};

exports.deleteShare = async (req, res) => {
  try {
    const share = await Share.findByIdAndDelete(req.params.shareId);

    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    // Check authorization to delete the share

    res.json({ message: 'Share deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting share' });
  }
};
