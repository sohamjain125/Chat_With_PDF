import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  pdfId: mongoose.Types.ObjectId;
  userId?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    context?: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  context: [{
    type: String
    // Removed maxlength constraint to allow longer context chunks
  }]
});

const ChatSchema = new Schema({
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PDF',
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  messages: [MessageSchema]
}, {
  timestamps: true
});

// Indexes for better query performance
ChatSchema.index({ pdfId: 1, createdAt: -1 });
ChatSchema.index({ userId: 1, updatedAt: -1 });

// Virtual for getting the last message
ChatSchema.virtual('lastMessage').get(function() {
  if (this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Ensure virtual fields are serialized
ChatSchema.set('toJSON', { virtuals: true });
ChatSchema.set('toObject', { virtuals: true });

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
