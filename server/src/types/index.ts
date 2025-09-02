import { Request } from 'express';

// Express Request extensions
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  params: any;
  body: any;
  query: any;
}

// PDF related types
export interface PDFMetadata {
  title?: string;
  author?: string;
  pages?: number;
  language?: string;
}

export interface PDFChunk {
  text: string;
  embedding: number[];
  chunkIndex: number;
}

export interface PDFDocument {
  _id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  uploadDate: Date;
  totalChunks: number;
  chunks: PDFChunk[];
  metadata: PDFMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// Chat related types
export interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string[];
}

export interface ChatSession {
  _id: string;
  pdfId: string;
  userId?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
}

// File upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Gemini API types
export interface EmbeddingResponse {
  values: number[];
}

export interface ChatResponse {
  answer: string;
  context: string[];
  chatId: string;
  messageId: string;
}
