import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// GET
export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find({ userId: req.user._id });
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);


  res.status(200).json({ page, perPage, totalNotes, totalPages, notes });
};

// GET by ID
export const getNoteById = async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.noteId,
    userId: req.user._id
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// POST
export const createNote = async (req, res) => {
  const { title, content, tag } = req.body ?? {};
  const note = await Note.create({ title, content, tag, userId: req.user._id });
//  const note = await Note.create({ ...req.body, userId: req.user._id });

  res.status(201).json(note);
};

// DELETE
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

// PATCH
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updates = {};

  for (const field of ['title', 'content', 'tag']) {
    if (Object.hasOwn(req.body ?? {}, field)) {
      updates[field] = req.body[field];
    }
  }

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    { $set: updates },
    { returnDocument: 'after', runValidators: true});

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
