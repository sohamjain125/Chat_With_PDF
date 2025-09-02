// PDF related types
export interface PDFMetadata {
  title?: string;
  author?: string;
  pages?: number;
  language?: string;
}

export interface PDFDocument {
  _id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  uploadDate: string;
  totalChunks: number;
  metadata: PDFMetadata;
  createdAt: string;
  updatedAt: string;
}

// Chat related types
export interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: string[];
}

export interface ChatSession {
  _id: string;
  pdfId: string;
  userId?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
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
export interface UploadResponse {
  id: string;
  filename: string;
  originalName: string;
  totalChunks: number;
  metadata: PDFMetadata;
}

// Chat response types
export interface ChatResponse {
  answer: string;
  context: string[];
  chatId: string;
  messageId: string;
}

// Component props types
export interface PDFUploadProps {
  onUploadSuccess: (pdf: UploadResponse) => void;
  onUploadError: (error: string) => void;
}

export interface ChatInterfaceProps {
  pdfId: string;
  pdfName: string;
}

export interface MessageBubbleProps {
  message: ChatMessage;
}

export interface PDFListProps {
  pdfs: PDFDocument[];
  selectedPDF: PDFDocument | null;
  onSelectPDF: (pdf: PDFDocument) => void;
  onDeletePDF: (pdfId: string) => void;
  isLoading: boolean;
}
