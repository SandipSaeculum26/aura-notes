import Note from "../models/note.js";

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({}).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isPinned } = req.body;
    
    const note = await Note.findByIdAndUpdate(
      id,
      { title, content, isPinned },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { createNote, getNotes, updateNote, deleteNote };
