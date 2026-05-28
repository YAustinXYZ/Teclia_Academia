import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { getContent, getContentById, uploadContent, deleteContent, getFreeContent } from '../controllers/contentController.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');
import fs from 'fs';
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadsDir),
	filename: (req, file, cb) => {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, `${unique}${ext}`);
	}
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', getContent);
router.get('/free', verifyToken, getFreeContent);
router.get('/:id', getContentById);

// Admin-only upload endpoint (supports file upload via 'file')
router.post('/upload', verifyToken, adminOnly, upload.single('file'), uploadContent);

// Admin-only delete
router.delete('/:id', verifyToken, adminOnly, deleteContent);

export default router;
