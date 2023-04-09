const Note = require("../model/Note");
const bcrypt = require("bcrypt");
const User = require("../model/User");

const getNotes = async (req, res) => {
  const notes = await Note.find().lean().exec();
  if (!notes?.length)
    return res.status(401).json({ message: "NO notes data found" });

  const notesWithUserName = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note?.user).exec();
      return {
        ...note,
        username: user?.username,
      };
    })
  );
  res.json(notesWithUserName);
};

const addNote = async (req, res) => {
  const { user, text, title } = req.body;
  if (!user || !text || !title)
    return res.status(400).json({ message: "All fields required" });
  const checkDuplicate = await Note.findOne({ title })
    .collation({
      locale: "en",
      strength: 2,
    })
    .exec();

  if (checkDuplicate)
    return res
      .status(409)
      .json({ message: "Conflict , duplicate title found" });

  const newNoteObj = {
    user: user,
    title: title,
    text: text,
  };

  if (newNoteObj) {
    await Note.create(newNoteObj);
    res.json({ message: `a new note ${user} has been created` });
  } else {
    return res
      .status(400)
      .json({ message: "new note object could not create" });
  }
};

const editNote = async (req, res) => {
  const { id, user, text, title, isComplete } = req.body;
  if (!id || !user?.length)
    return res.status(400).json({ message: "id required to edit note" });
  const findNoteToEdit = await Note.findById(id).exec();
  if (!findNoteToEdit)
    return res.status(400).json({ message: "no such note found" });

  const checkDuplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (checkDuplicate && checkDuplicate._id.toString() !== id)
    return res.json({ message: "Conflict , duplicate note" });

  findNoteToEdit.user = user;
  findNoteToEdit.title = title;

  if (text) {
    findNoteToEdit.text = text;
  }
  if (isComplete) {
    findNoteToEdit.isComplete = isComplete;
  }

  await findNoteToEdit.save();

  res.json({ message: `a note ${title} has been edited` });
};

const deleteNote = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.json({ message: "id required to delete" });
  const findToDelete = await Note.findById(id).exec();
  if (!findToDelete)
    return res.json({ message: "No Such Note found to Delete" });
  await Note.deleteOne(findToDelete);
  res.json({ message: "A note has been deleted" });
};

module.exports = { getNotes, addNote, editNote, deleteNote };
