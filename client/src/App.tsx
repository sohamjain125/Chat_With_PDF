import { useState, useEffect } from 'react';
import { PDFUpload } from './components/PDFUpload';
import { PDFList } from './components/PDFList';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { pdfAPI, healthCheck } from './services/api';
import type { PDFDocument, UploadResponse } from './types';
import './App.css';

function App() {
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<PDFDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Check server status on mount
  useEffect(() => {
    checkServerStatus();
    loadPDFs();
  }, []);

  const checkServerStatus = async () => {
    try {
      const isOnline = await healthCheck();
      setServerStatus(isOnline ? 'online' : 'offline');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const loadPDFs = async () => {
    try {
      setIsLoading(true);
      const fetchedPDFs = await pdfAPI.getAll();
      setPdfs(fetchedPDFs);
    } catch (error) {
      console.error('Failed to load PDFs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (uploadResponse: UploadResponse) => {
    // Convert UploadResponse to PDFDocument format
    const pdfDocument: PDFDocument = {
      _id: uploadResponse.id,
      filename: uploadResponse.filename,
      originalName: uploadResponse.originalName,
      fileSize: 0, // Will be updated when PDFs are reloaded
      uploadDate: new Date().toISOString(),
      totalChunks: uploadResponse.totalChunks,
      metadata: uploadResponse.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setPdfs(prev => [pdfDocument, ...prev]);
    setSelectedPDF(pdfDocument);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // You could add a toast notification here
  };

  const handlePDFSelect = (pdf: PDFDocument) => {
    setSelectedPDF(pdf);
  };

  const handlePDFDelete = async (pdfId: string) => {
    try {
      await pdfAPI.delete(pdfId);
      setPdfs(prev => prev.filter(pdf => pdf._id !== pdfId));
      
      // If the deleted PDF was selected, clear selection
      if (selectedPDF?._id === pdfId) {
        setSelectedPDF(null);
      }
    } catch (error) {
      console.error('Failed to delete PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header serverStatus={serverStatus} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - PDF Management */}
          <div className="lg:col-span-1 space-y-6">
            {/* PDF Upload Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upload PDF</h2>
                  <p className="text-sm text-gray-600">Add new documents to chat with</p>
                </div>
              </div>
              <PDFUpload 
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>

            {/* PDF List Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your PDFs</h2>
                    <p className="text-sm text-gray-600">{pdfs.length} document{pdfs.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
              <PDFList
                pdfs={pdfs}
                selectedPDF={selectedPDF}
                onSelectPDF={handlePDFSelect}
                onDeletePDF={handlePDFDelete}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="lg:col-span-2">
            {selectedPDF ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-[calc(100vh-200px)]">
                <ChatInterface
                  pdfId={selectedPDF._id}
                  pdfName={selectedPDF.originalName}
                />
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Chat with Your PDFs?
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Select a PDF from the list or upload a new one to start asking questions and get AI-powered insights.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Upload PDFs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Ask Questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Get AI Answers</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
