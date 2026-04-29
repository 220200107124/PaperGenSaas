import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuestionsAIService {
  private readonly logger = new Logger(QuestionsAIService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
    try {
      this.logger.log(`Starting PDF extraction. Buffer size: ${fileBuffer.length}`);
      
      const { PDFParse } = require('pdf-parse');
      
      if (typeof PDFParse !== 'function') {
         // Maybe it's the old version?
         const pdf = require('pdf-parse');
         if (typeof pdf === 'function') {
            const result = await pdf(fileBuffer);
            return result.text;
         }
         throw new Error(`PDFParse class not found. Keys: ${Object.keys(pdf).join(', ')}`);
      }

      const parser = new PDFParse({ data: fileBuffer });
      const result = await parser.getText();
      return result.text;
    } catch (error) {
      this.logger.error('Failed to parse PDF', error.stack);
      throw new Error(`Could not extract text from PDF: ${error.message}`);
    }
  }

  
async generateQuestionsFromText(text: string): Promise<any[]> {
  if (!this.genAI) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) this.genAI = new GoogleGenerativeAI(apiKey);
  }

  if (!this.genAI) {
    this.logger.error('Gemini API key is missing.');
    return [];
  }

  try {
    // FIX: Using 'v1' instead of 'v1beta'
    const model = this.genAI.getGenerativeModel(
      { model: 'gemini-1.5-flash' },
      { apiVersion: 'v1' }
    );

    const prompt = `
      You are an expert Gujarati language question paper generator.
      Extract academic questions from the provided text and convert them into a structured JSON array.
      
      IMPORTANT: The text is in Gujarati. Please keep the questionText, options, and answer in Gujarati.
      
      Question Format:
      {
        "questionText": "Question in Gujarati",
        "questionType": "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "SHORT" | "LONG" | "MATCH",
        "options": ["Option A", "Option B", "Option C", "Option D"], // null if not MCQ/MATCH
        "answer": "Correct Answer",
        "marks": number,
        "difficulty": "EASY" | "MEDIUM" | "HARD"
      }

      Return ONLY a pure valid JSON array. Do not include markdown formatting or any other text.
      
      TEXT:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonText = response.text().trim();
    
    // Clean up markdown block syntax if the model provides it anyway
    jsonText = jsonText.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();

    return JSON.parse(jsonText);
  } catch (error) {
    this.logger.error(`Gemini API Error: ${error.message}`);
    
    if (error.message.includes('404')) {
        this.logger.warn('Attempting fallback to gemini-1.5-flash-latest...');
        return this.retryWithLatest(text);
    }
    
    return [];
  }
}

private async retryWithLatest(text: string): Promise<any[]> {
    try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const prompt = `Convert the following text into a JSON array of Gujarati questions: ${text}`;
        const result = await model.generateContent(prompt);
        const text_1 = result.response.text().replace(/^```json\n?|```$/gi, '').trim();
        return JSON.parse(text_1);
    } catch (e) {
        return [];
    }
}
}

