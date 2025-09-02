import { Request, Response, NextFunction } from 'express';
import { PDF } from '../models/PDF';
import { Chat } from '../models/Chat';
import { generateAnswer, generateEmbeddings } from '../config/gemini';

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Find most relevant chunks using vector similarity
const findRelevantChunks = async (query: string, pdfId: string, topK: number = 3) => {
  const queryEmbedding = await generateEmbeddings(query);
  
  const pdf = await PDF.findById(pdfId);
  if (!pdf) throw new Error('PDF not found');
  
  // Calculate similarity scores for all chunks
  const chunksWithScores = pdf.chunks.map(chunk => ({
    text: chunk.text,
    embedding: chunk.embedding,
    chunkIndex: chunk.chunkIndex,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  
  // Sort by similarity and return top K chunks
  return chunksWithScores
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
};

// Create new chat session
export const createNewChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { pdfId } = req.body;
    
    if (!pdfId) {
      res.status(400).json({
        success: false,
        error: 'PDF ID is required'
      });
      return;
    }
    
    // Verify PDF exists
    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      res.status(404).json({
        success: false,
        error: 'PDF not found'
      });
      return;
    }
    
    // Create new chat session
    const chat = new Chat({
      pdfId,
      messages: []
    });
    
    await chat.save();
    
    res.status(201).json({
      success: true,
      message: 'New chat session created',
      data: {
        chatId: chat._id,
        pdfId: chat.pdfId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Chat with PDF
export const chatWithPDF = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { pdfId } = req.params;
    const { query, chatId } = req.body;
    
    if (!query) {
      res.status(400).json({
        success: false,
        error: 'Query is required'
      });
      return;
    }
    
    // Find or create chat session
    let chat = chatId ? await Chat.findById(chatId) : null;
    if (!chat) {
      chat = new Chat({ pdfId, messages: [] });
    }
    
    // Find relevant chunks
    const relevantChunks = await findRelevantChunks(query, pdfId);
    
    // Truncate context chunks to reasonable length (800 chars) to avoid database issues
    const contextTexts = relevantChunks.map(chunk => {
      const text = chunk.text;
      if (text.length > 800) {
        return text.substring(0, 800) + '...';
      }
      return text;
    });
    
    // Generate AI response
    const answer = await generateAnswer(query, contextTexts);
    
    // Add messages to chat
    chat.messages.push({
      role: 'user',
      content: query,
      timestamp: new Date(),
      context: contextTexts
    });
    
    chat.messages.push({
      role: 'assistant',
      content: answer,
      timestamp: new Date(),
      context: contextTexts
    });
    
    await chat.save();
    
    // Generate a unique message ID since the message object doesn't have _id
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      data: {
        answer,
        context: contextTexts,
        chatId: chat._id,
        messageId
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Get chat history for a PDF
export const getChatHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { pdfId } = req.params;
    
    const chats = await Chat.find({ pdfId })
      .sort({ updatedAt: -1 })
      .limit(10); // Limit to last 10 chats
    
    res.json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    next(error);
  }
};
