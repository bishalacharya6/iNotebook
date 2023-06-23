const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route 1 -Fetch all notes - retriving the notes of the users.

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    //catching the unexpected error
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Route 2 -Adding the new notes useing post - adding the notes of the users.

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ ming: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      const error = validationResult(req); // if the validatio is not done then return error
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      //catching the unexpected erro
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Updating the note
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //Create the new note or updated note
    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note that will be updated, and then update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
    
  } catch (error) {
    //catching the unexpected erro
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// deleating the note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note that will be deleted, and then delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Sucess: "Note has been deleted", note: note });

  } catch (error) {
    //catching the unexpected erro
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
