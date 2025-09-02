import axios from 'axios';
import type { 
  APIResponse, 
  PDFDocument, 
  UploadResponse, 
  ChatResponse, 
  ChatSession 
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// PDF API endpoints
export const pdfAPI = {
  // Upload PDF
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await api.post<APIResponse<UploadResponse>>('/api/pdf/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Upload failed');
    }
    
    return response.data.data!;
  },

  // Get all PDFs
  getAll: async (): Promise<PDFDocument[]> => {
    const response = await api.get<APIResponse<PDFDocument[]>>('/api/pdf');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch PDFs');
    }
    
    return response.data.data || [];
  },

  // Get PDF by ID
  getById: async (id: string): Promise<PDFDocument> => {
    const response = await api.get<APIResponse<PDFDocument>>(`/api/pdf/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'PDF not found');
    }
    
    return response.data.data!;
  },

  // Delete PDF
  delete: async (id: string): Promise<void> => {
    const response = await api.delete<APIResponse>(`/pdf/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete PDF');
    }
  },
};

// Chat API endpoints
export const chatAPI = {
  // Create new chat session
  createNew: async (pdfId: string): Promise<{ chatId: string; pdfId: string }> => {
    const response = await api.post<APIResponse<{ chatId: string; pdfId: string }>>('/api/chat/new', {
      pdfId,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create chat session');
    }
    
    return response.data.data!;
  },

  // Chat with PDF
  sendMessage: async (pdfId: string, query: string, chatId?: string): Promise<ChatResponse> => {
    const response = await api.post<APIResponse<ChatResponse>>(`/api/chat/${pdfId}`, {
      query,
      chatId,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to send message');
    }
    
    return response.data.data!;
  },

  // Get chat history
  getHistory: async (pdfId: string): Promise<ChatSession[]> => {
    const response = await api.get<APIResponse<ChatSession[]>>(`/api/chat/${pdfId}/history`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch chat history');
    }
    
    return response.data.data || [];
  },
};

// Auth API endpoints
export const authAPI = {
  // Register user
  register: async (name: string, email: string, password: string): Promise<{ user: any; token: string }> => {
    const response = await api.post<APIResponse<{ user: any; token: string }>>('/api/auth/register', {
      name,
      email,
      password,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Registration failed');
    }
    
    return response.data.data!;
  },

  // Login user
  login: async (email: string, password: string): Promise<{ user: any; token: string }> => {
    const response = await api.post<APIResponse<{ user: any; token: string }>>('/api/auth/login', {
      email,
      password,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Login failed');
    }
    
    return response.data.data!;
  },

  // Get current user
  getCurrentUser: async (): Promise<any> => {
    const response = await api.get<APIResponse<{ user: any }>>('/api/auth/me');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to get user');
    }
    
    return response.data.data!.user;
  },

  // Check auth status
  checkStatus: async (): Promise<{ authenticated: boolean; user?: any }> => {
    try {
      const response = await api.get<APIResponse<{ authenticated: boolean; user?: any }>>('/api/auth/status');
      return response.data.data!;
    } catch (error) {
      return { authenticated: false };
    }
  },
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default api;
