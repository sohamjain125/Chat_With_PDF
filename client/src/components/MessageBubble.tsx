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
        <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            isUser 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-sm ${
            isUser 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
            
            {/* Timestamp */}
            <div className={`text-xs mt-1 sm:mt-2 ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatDate(message.timestamp)}
            </div>
          </div>
        </div>

        {/* Context Toggle (for AI messages with context) */}
        {!isUser && hasContext && (
          <div className="ml-1 sm:ml-2">
            <button
              onClick={() => setShowContext(!showContext)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
        <div className="ml-9 sm:ml-11 mt-2 sm:mt-3 mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-semibold text-blue-900">Sources from PDF</span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {message.context!.map((contextText, index) => (
                <div
                  key={index}
                  className="text-xs sm:text-sm text-blue-800 bg-white/60 rounded-lg p-2 sm:p-3 border border-blue-100"
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
