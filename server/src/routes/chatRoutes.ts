import express from 'express';
import { chatWithPDF, getChatHistory, createNewChat } from '../controllers/chatController';

const router = express.Router();

// Create new chat session
router.post('/new', createNewChat);

// Chat with PDF
router.post('/:pdfId', chatWithPDF);

// Get chat history for a PDF
router.get('/:pdfId/history', getChatHistory);

export default router;
