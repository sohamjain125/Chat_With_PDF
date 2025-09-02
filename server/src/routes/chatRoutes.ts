import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { chatWithPDF, getChatHistory, createNewChat } from '../controllers/chatController';

const router = express.Router();

// Create new chat session (requires authentication)
router.post('/new', authenticateToken, createNewChat);

// Chat with PDF (requires authentication)
router.post('/:pdfId', authenticateToken, chatWithPDF);

// Get chat history for a PDF (requires authentication)
router.get('/:pdfId/history', authenticateToken, getChatHistory);

export default router;
