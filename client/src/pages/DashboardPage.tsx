import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFUpload } from '../components/PDFUpload';
import { PDFList } from '../components/PDFList';
import { ChatInterface } from '../components/ChatInterface';
import { Header } from '../components/Header';
import { pdfAPI, healthCheck, authAPI } from '../services/api';
import type { PDFDocument, UploadResponse } from '../types';
import { LogOut, User } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<PDFDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [user, setUser] = useState<any>(null);

  // Check server status and auth on mount
  useEffect(() => {
    checkServerStatus();
    checkAuthStatus();
    loadPDFs();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const status = await authAPI.checkStatus();
        if (status.authenticated) {
          setUser(JSON.parse(userData));
        } else {
          // Token is invalid, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        // Token is invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header 
        serverStatus={serverStatus} 
        user={user}
        onLogin={() => navigate('/login')}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Sidebar - PDF Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* PDF Upload Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Upload PDF</h2>
                  <p className="text-slate-600">Add new documents to chat with</p>
                </div>
              </div>
              <PDFUpload 
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>

            {/* PDF List Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your PDFs</h2>
                    <p className="text-slate-600">{pdfs.length} document{pdfs.length !== 1 ? 's' : ''}</p>
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
          <div className="lg:col-span-3">
            {selectedPDF ? (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 h-[calc(100vh-120px)]">
                <ChatInterface
                  pdfId={selectedPDF._id}
                  pdfName={selectedPDF.originalName}
                />
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-16 text-center h-[calc(100vh-120px)] flex items-center justify-center">
                <div className="max-w-2xl">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-12">
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-6">
                    Ready to Chat with Your PDFs?
                  </h3>
                  <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                    Select a PDF from the list or upload a new one to start asking questions and get AI-powered insights.
                  </p>
                  <div className="flex items-center justify-center space-x-8 text-lg text-slate-500">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Upload PDFs</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Ask Questions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span>Get AI Answers</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
