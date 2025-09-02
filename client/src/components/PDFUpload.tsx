import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { pdfAPI } from '../services/api';
import { validatePDFFile, formatFileSize } from '../utils';
import type { PDFUploadProps } from '../types';

export function PDFUpload({ onUploadSuccess, onUploadError }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validation = validatePDFFile(file);

    if (!validation.isValid) {
      onUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploadedFile(file);
    await handleUpload(file);
  }, [onUploadError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleUpload = async (file: File) => {
    let progressInterval: ReturnType<typeof setTimeout> | undefined;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await pdfAPI.upload(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onUploadSuccess(response);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      if (typeof progressInterval !== 'undefined') {
        clearInterval(progressInterval);
      }
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
          ${isDragReject ? 'border-red-400 bg-red-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploadedFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">File selected</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{uploadedFile.name}</span>
              <span className="text-gray-400">({formatFileSize(uploadedFile.size)})</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? isDragReject
                    ? 'PDF files only!'
                    : 'Drop the PDF here...'
                  : 'Drag & drop a PDF here, or click to select'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum file size: 20MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* File Actions */}
      {uploadedFile && !isUploading && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{uploadedFile.name}</span>
          </div>
          <button
            onClick={removeFile}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Button */}
      {uploadedFile && !isUploading && (
        <button
          onClick={() => handleUpload(uploadedFile)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      )}
    </div>
  );
}
