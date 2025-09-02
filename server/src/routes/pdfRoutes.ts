import express from 'express';
import { upload, handleMulterError } from '../middleware/upload';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { uploadPDF, getPDFs, getPDFById, deletePDF } from '../controllers/pdfController';

const router = express.Router();

// Upload PDF (requires authentication)
router.post('/upload', authenticateToken, upload.single('pdf'), handleMulterError, uploadPDF);

// Get all PDFs (optional auth - shows user's PDFs if authenticated, all if not)
router.get('/', optionalAuth, getPDFs);

// Get PDF by ID (optional auth)
router.get('/:id', optionalAuth, getPDFById);

// Delete PDF (requires authentication)
router.delete('/:id', authenticateToken, deletePDF);

export default router;
