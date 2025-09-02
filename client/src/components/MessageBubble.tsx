import { useState } from 'react';
import { Bot, User, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { formatDate } from '../utils';
import type { MessageBubbleProps } from '../types';

export function MessageBubble({ message }: MessageBubbleProps) {
  const [showContext, setShowContext] = useState(false);

  const isUser = message.role === 'user';
  const hasContext = message.context && message.context.length > 0;

  return (
    <>
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            isUser 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600'
          }`}>
            {isUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`rounded-2xl px-5 py-3 shadow-sm ${
            isUser 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
            
            {/* Timestamp */}
            <div className={`text-xs mt-2 ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatDate(message.timestamp)}
            </div>
          </div>
        </div>

        {/* Context Toggle (for AI messages with context) */}
        {!isUser && hasContext && (
          <div className="ml-2">
            <button
              onClick={() => setShowContext(!showContext)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={showContext ? 'Hide context' : 'Show context'}
            >
              {showContext ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Context Display */}
      {!isUser && hasContext && showContext && (
        <div className="ml-11 mt-3 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Sources from PDF</span>
            </div>
            <div className="space-y-3">
              {message.context!.map((contextText, index) => (
                <div
                  key={index}
                  className="text-sm text-blue-800 bg-white/60 rounded-lg p-3 border border-blue-100"
                >
                  <span className="font-medium text-blue-900">Chunk {index + 1}:</span> {contextText}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
