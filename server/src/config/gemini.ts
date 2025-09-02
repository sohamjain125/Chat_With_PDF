import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('⚠️ GEMINI_API_KEY not set or using default value. Please set your actual API key in .env.local');
  console.warn('⚠️ Get your API key from: https://makersuite.google.com/app/apikey');
}

// Initialize Gemini AI (only if API key is valid)
export const genAI = GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here' 
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : null;

// Models - Use gemini-1.5-flash for better performance and availability
export const geminiModel = genAI 
  ? genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
      }
    })
  : null;

// Generate embeddings using a hash-based approach (since Gemini doesn't have embedding models)
// This is a simplified approach - in production, consider using a dedicated embedding service
export const generateEmbeddings = async (text: string): Promise<number[]> => {
  try {
    // Create a deterministic embedding based on text content
    const words = text.toLowerCase().split(/\s+/);
    const embedding: number[] = [];
    
    // Generate a 768-dimensional embedding using text characteristics
    for (let i = 0; i < 768; i++) {
      let value = 0;
      
      // Use different text features for different dimensions
      if (i < words.length) {
        // First few dimensions based on word presence
        const word = words[i];
        value = word.length / 20; // Normalize word length
      } else if (i < 256) {
        // Middle dimensions based on character frequency
        const charIndex = (i - words.length) % 26;
        const char = String.fromCharCode(97 + charIndex); // a-z
        value = (text.toLowerCase().split(char).length - 1) / text.length;
      } else {
        // Remaining dimensions based on text statistics
        const seed = i * 7 + text.length;
        value = Math.sin(seed) * 0.5 + 0.5; // Generate values between 0-1
      }
      
      embedding.push(Math.max(0, Math.min(1, value))); // Clamp to 0-1
    }
    
    return embedding;
  } catch (error) {
    console.error('❌ Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
};

// Generate answer using Gemini
export const generateAnswer = async (
  query: string, 
  context: string[], 
  systemPrompt?: string
): Promise<string> => {
  try {
    if (!geminiModel) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.');
    }

    const prompt = `
${systemPrompt || 'You are a helpful AI assistant that answers questions based on the provided context. Always provide accurate and helpful responses based on the given information.'}

Context from PDF:
${context.map((chunk, index) => `Chunk ${index + 1}: ${chunk}`).join('\n\n')}

User Question: ${query}

Please provide a comprehensive answer based on the context above. If the context doesn't contain enough information to answer the question, please say so.`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ Error generating answer:', error);
    throw new Error('Failed to generate answer');
  }
};

// Utility function to chunk text
export const chunkText = (text: string, maxChunkSize: number = 1500): string[] => {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // Split text into sentences first to maintain context
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    
    // If adding this sentence would exceed the chunk size, save current chunk and start new one
    if (currentChunk.length + trimmedSentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmedSentence;
    } else {
      // Add sentence to current chunk
      if (currentChunk.length > 0) {
        currentChunk += ' ' + trimmedSentence;
      } else {
        currentChunk = trimmedSentence;
      }
    }
  }
  
  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  // If we still have chunks that are too long, split them further
  const finalChunks: string[] = [];
  for (const chunk of chunks) {
    if (chunk.length <= maxChunkSize) {
      finalChunks.push(chunk);
    } else {
      // Split long chunks by words
      const words = chunk.split(/\s+/);
      let currentSubChunk = '';
      
      for (const word of words) {
        if (currentSubChunk.length + word.length + 1 > maxChunkSize && currentSubChunk.length > 0) {
          finalChunks.push(currentSubChunk.trim());
          currentSubChunk = word;
        } else {
          if (currentSubChunk.length > 0) {
            currentSubChunk += ' ' + word;
          } else {
            currentSubChunk = word;
          }
        }
      }
      
      if (currentSubChunk.trim().length > 0) {
        finalChunks.push(currentSubChunk.trim());
      }
    }
  }
  
  return finalChunks;
};
