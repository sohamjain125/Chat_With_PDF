# 📄 Chat with PDF

An AI-powered web application that allows users to upload PDF documents and interact with them through natural language conversations. Built with **Vite + React (frontend)**, **Node.js/Express (backend)**, **MongoDB (database)**, and **Google Gemini API (LLM & embeddings)**.

## ✨ Features

- **PDF Upload & Processing**: Drag & drop PDF files with automatic text extraction and chunking
- **AI-Powered Chat**: Ask questions about your PDFs and get intelligent, context-aware answers
- **Vector Search**: Advanced semantic search using Google Gemini embeddings
- **Chat History**: Persistent conversation history for each PDF
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Real-time Processing**: Live chat with loading indicators and progress tracking

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │ Express Backend │    │   MongoDB Atlas │
│                 │◄──►│                 │◄──►│                 │
│ • PDF Upload    │    │ • PDF Parsing   │    │ • PDF Metadata  │
│ • Chat Interface│    │ • Text Chunking │    │ • Embeddings    │
│ • File Management│   │ • AI Integration│    │ • Chat History  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Google Gemini  │
                       │                 │
                       │ • Embeddings    │
                       │ • Text Generation│
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone & Install

```bash
git clone <repository-url>
cd chat-with-pdf

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create `.env` file in the `server` directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chat-with-pdf
# OR for MongoDB Atlas:
# MONGODB_URI_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/chat-with-pdf

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=20971520
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Start Development Servers

```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Dropzone** - File upload handling
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Google Gemini AI** - LLM & embeddings
- **Multer** - File upload middleware
- **PDF-parse** - PDF text extraction

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart server
- **Jest** - Testing framework

## 📁 Project Structure

```
chat-with-pdf/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### PDF Management
- `POST /api/pdf/upload` - Upload and process PDF
- `GET /api/pdf` - Get all PDFs
- `GET /api/pdf/:id` - Get PDF by ID
- `DELETE /api/pdf/:id` - Delete PDF

### Chat
- `POST /api/chat/new` - Create new chat session
- `POST /api/chat/:pdfId` - Send message to PDF
- `GET /api/chat/:pdfId/history` - Get chat history

### Health
- `GET /health` - Server health check

## 🎯 How It Works

1. **PDF Upload**: User uploads a PDF file through drag & drop
2. **Text Extraction**: Backend extracts text content using `pdf-parse`
3. **Chunking**: Text is split into ~500-word chunks for better processing
4. **Embeddings**: Each chunk is converted to vector embeddings using Gemini
5. **Storage**: PDF metadata and embeddings are stored in MongoDB
6. **Chat**: User asks questions in natural language
7. **Vector Search**: Query is converted to embedding and compared with stored chunks
8. **AI Response**: Most relevant chunks are sent to Gemini for context-aware answers
9. **Display**: Response is shown with source context from PDF

## 🔒 Security Features

- **File Validation**: PDF-only uploads with size limits
- **Rate Limiting**: API request throttling
- **Input Sanitization**: Protection against injection attacks
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers middleware

## 🚀 Deployment

### Backend (Render/Heroku)
```bash
cd server
npm run build
# Deploy dist/ folder
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Environment Variables
Set production environment variables in your hosting platform:
- `MONGODB_URI_ATLAS` - MongoDB Atlas connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Google Gemini** for AI capabilities
- **MongoDB** for database
- **Vite** for fast development
- **Tailwind CSS** for beautiful UI components

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Happy Chatting! 🚀**
