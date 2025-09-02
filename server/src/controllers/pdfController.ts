import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { PDF } from '../models/PDF';
import { generateEmbeddings, chunkText } from '../config/gemini';

// Upload and process PDF
export const uploadPDF = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No PDF file uploaded'
      });
      return;
    }

    const { filename, originalname, size } = req.file;
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', filename);

    // Read and parse PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    // Extract text and metadata
    const text = pdfData.text;
    const metadata = {
      pages: pdfData.numpages,
      title: pdfData.info?.Title || originalname,
      author: pdfData.info?.Author || 'Unknown',
      language: 'en' // Default language
    };

    // Chunk text into smaller pieces
    const chunks = chunkText(text);
    
    // Generate embeddings for each chunk
    const chunksWithEmbeddings = await Promise.all(
      chunks.map(async (chunkText, index) => {
        const embedding = await generateEmbeddings(chunkText);
        return {
          text: chunkText,
          embedding,
          chunkIndex: index
        };
      })
    );

    // Create PDF document in database
    const pdfDoc = new PDF({
      filename,
      originalName: originalname,
      fileSize: size,
      totalChunks: chunks.length,
      chunks: chunksWithEmbeddings,
      metadata
    });

    await pdfDoc.save();

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: 'PDF uploaded and processed successfully',
      data: {
        id: pdfDoc._id,
        filename: pdfDoc.filename,
        originalName: pdfDoc.originalName,
        totalChunks: pdfDoc.totalChunks,
        metadata: pdfDoc.metadata
      }
    });

  } catch (error) {
    // Clean up file on error
    if (req.file) {
      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// Get all PDFs
export const getPDFs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pdfs = await PDF.find({}, {
      chunks: 0 // Exclude chunks to reduce response size
    }).sort({ uploadDate: -1 });

    res.json({
      success: true,
      count: pdfs.length,
      data: pdfs
    });
  } catch (error) {
    next(error);
  }
};

// Get PDF by ID
export const getPDFById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pdf = await PDF.findById(req.params.id, {
      chunks: 0 // Exclude chunks to reduce response size
    });

    if (!pdf) {
      res.status(404).json({
        success: false,
        error: 'PDF not found'
      });
      return;
    }

    res.json({
      success: true,
      data: pdf
    });
  } catch (error) {
    next(error);
  }
};

// Delete PDF
export const deletePDF = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      res.status(404).json({
        success: false,
        error: 'PDF not found'
      });
      return;
    }

    await PDF.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'PDF deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
