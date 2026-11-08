import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

// GET
router.get('/notes', getAllNotes);

// GET by ID
router.get('/notes/:noteId', getNoteById);

// POST
router.post('/notes', createNote);

// DELETE
router.delete('/notes/:noteId', deleteNote);

// PATCH
router.patch('/notes/:noteId', updateNote);

export default router;
