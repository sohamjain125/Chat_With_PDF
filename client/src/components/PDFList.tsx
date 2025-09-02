import { useState } from 'react';
import { FileText, Trash2, Eye, Calendar, HardDrive, MessageSquare } from 'lucide-react';
import { formatFileSize, formatDate } from '../utils';
import type { PDFListProps, PDFDocument } from '../types';

export function PDFList({ 
  pdfs, 
  selectedPDF, 
  onSelectPDF, 
  onDeletePDF, 
  isLoading 
}: PDFListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (pdfId: string) => {
    if (confirm('Are you sure you want to delete this PDF? This action cannot be undone.')) {
      setDeletingId(pdfId);
      try {
        await onDeletePDF(pdfId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (pdfs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No PDFs yet</h3>
        <p className="text-gray-500">Upload your first PDF to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pdfs.map((pdf: PDFDocument) => {
        const isSelected = selectedPDF?._id === pdf._id;
        const isDeleting = deletingId === pdf._id;
        
        return (
          <div
            key={pdf._id}
            className={`group relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
              isSelected 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => onSelectPDF(pdf)}
          >
            {/* Selection Indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full"></div>
            )}

            {/* PDF Content */}
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }`}>
                <FileText className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1 truncate">
                  {pdf.originalName}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center space-x-1">
                    <HardDrive className="w-3 h-3" />
                    <span>{formatFileSize(pdf.fileSize)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{pdf.totalChunks} chunks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(pdf.uploadDate)}</span>
                  </div>
                </div>

                {/* Metadata */}
                {pdf.metadata && (pdf.metadata.title || pdf.metadata.author) && (
                  <div className="text-xs text-gray-400 space-y-1">
                    {pdf.metadata.title && (
                      <div className="truncate">Title: {pdf.metadata.title}</div>
                    )}
                    {pdf.metadata.author && (
                      <div className="truncate">Author: {pdf.metadata.author}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPDF(pdf);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="View PDF"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pdf._id);
                  }}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  title="Delete PDF"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
