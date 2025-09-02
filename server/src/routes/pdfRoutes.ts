import express from 'express';
import { upload, handleMulterError } from '../middleware/upload';
import { uploadPDF, getPDFs, getPDFById, deletePDF } from '../controllers/pdfController';

const router = express.Router();

// Upload PDF
router.post('/upload', upload.single('pdf'), handleMulterError, uploadPDF);

// Get all PDFs
router.get('/', getPDFs);

// Get PDF by ID
router.get('/:id', getPDFById);

// Delete PDF
router.delete('/:id', deletePDF);

export default router;
