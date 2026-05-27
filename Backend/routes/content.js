import express from 'express';
import { getContent, getContentById, uploadContent, deleteContent } from '../controllers/contentController.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getContent);
router.get('/:id', getContentById);

// Admin-only upload endpoint
router.post('/upload', verifyToken, adminOnly, uploadContent);

// Admin-only delete
router.delete('/:id', verifyToken, adminOnly, deleteContent);

export default router;
