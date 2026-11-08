import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import { celebrate } from 'celebrate';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

// GET
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

// GET by ID
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

// POST
router.post('/notes', celebrate(createNoteSchema), createNote);

// DELETE
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

// PATCH
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
