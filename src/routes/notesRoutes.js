import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();
router.use('/notes', authenticate);

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
