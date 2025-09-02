import mongoose, { Document, Schema } from 'mongoose';

export interface IPDF extends Document {
  filename: string;
  originalName: string;
  fileSize: number;
  uploadDate: Date;
  totalChunks: number;
  chunks: Array<{
    text: string;
    embedding: number[];
    chunkIndex: number;
  }>;
  userId?: string;
  metadata: {
    title?: string;
    author?: string;
    pages?: number;
    language?: string;
  };
}

const PDFChunkSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  }
});

const PDFSchema = new Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  totalChunks: {
    type: Number,
    required: true,
    min: 1
  },
  chunks: [PDFChunkSchema],
  userId: {
    type: String,
    required: false
  },
  metadata: {
    title: String,
    author: String,
    pages: Number,
    language: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PDFSchema.index({ userId: 1, uploadDate: -1 });
PDFSchema.index({ 'chunks.embedding': '2dsphere' });

// Virtual for getting text content
PDFSchema.virtual('fullText').get(function() {
  if (!this.chunks || !Array.isArray(this.chunks)) {
    return '';
  }
  return this.chunks
    .sort((a, b) => a.chunkIndex - b.chunkIndex)
    .map(chunk => chunk.text)
    .join(' ');
});

// Ensure virtual fields are serialized
PDFSchema.set('toJSON', { virtuals: true });
PDFSchema.set('toObject', { virtuals: true });

export const PDF = mongoose.model<IPDF>('PDF', PDFSchema);
