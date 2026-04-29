import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuestionsAIService {
  private readonly logger = new Logger(QuestionsAIService.name);
  // Using the 4 keys provided by the user as fallback options
  private apiKeys = [
    'AIzaSyAtVUSp1Ow9RlMAcWpzFsSM8IAeSrTnAJk',
    'AIzaSyABcSGHkDrrU8RMWFO8OdiMrJbFsWYlD3U',
    'AIzaSyCkraobttu3vBed-2XDCGh6wZYwCfhnThw',
    'AIzaSyCjtJIWZ1-uXgA4lpSCuYMGOJrGQCvhL-s'
  ];

  constructor(private configService: ConfigService) {}

  private async getWorkingModelAndKey(): Promise<{ model: any, key: string }> {
    // Try the one in .env first, then fall back to the list
    let envKey = this.configService.get<string>('GEMINI_API_KEY');
    const keysToTry = [...new Set([envKey, ...this.apiKeys])].filter(Boolean) as string[];

    for (const key of keysToTry) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        // We will test if 'gemini-1.5-flash' exists for this key
        const testModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        // Just fetching model info to see if it 404s
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash?key=${key}`);
        if (response.ok) {
          this.logger.log(`Verified working API Key (starts with ${key.substring(0, 10)}...)`);
          return { model: testModel, key };
        } else {
           // Try gemini-pro if 1.5-flash doesn't work
           const fallbackResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key=${key}`);
           if (fallbackResponse.ok) {
              this.logger.log(`Verified working API Key for gemini-2.0-flash (starts with ${key.substring(0, 10)}...)`);
              return { model: genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }), key };
           }
        }
      } catch (err) {z
        continue;
      }
    }
    
    this.logger.error('No working API keys found with access to required models.');
    // Default to the first key and gemini-1.5-flash anyway in case of network weirdness
    const finalKey = keysToTry[0] || this.apiKeys[0];
    return { model: new GoogleGenerativeAI(finalKey).getGenerativeModel({ model: 'gemini-1.5-flash' }), key: finalKey };
  }

  async extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
    try {
      this.logger.log(`Starting PDF extraction. Buffer size: ${fileBuffer.length}`);
      
      const { PDFParse } = require('pdf-parse');
      
      if (typeof PDFParse !== 'function') {
         const pdf = require('pdf-parse');
         if (typeof pdf === 'function') {
            const result = await pdf(fileBuffer);
            return result.text;
         }
         throw new Error(`PDFParse class not found`);
      }

      const parser = new PDFParse({ data: fileBuffer });
      const result = await parser.getText();
      this.logger.log(`Parsed PDF successfully. Total text length: ${result.text.length} characters.`);
      if (result.text.trim().length === 0) {
        this.logger.warn(`PDF extraction yielded NO TEXT. Please ensure this is not an image-based scanned PDF.`);
      }
      return result.text;
    } catch (error) {
      this.logger.error('Failed to parse PDF', error.stack);
      throw new Error(`Could not extract text from PDF: ${error.message}`);
    }
  }

  async generateQuestionsFromText(text: string): Promise<any[]> {
    try {
      const { model, key } = await this.getWorkingModelAndKey();
      
      if (!model) {
        this.logger.error('No valid Gemini Model found.');
        return [];
      }

      // Check what models are actually linked to this key to help debug
      try {
         const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
         if (listRes.ok) {
            const data = await listRes.json();
            const modelNames = data.models?.map((m: any) => m.name.replace('models/', '')) || [];
            this.logger.log(`Available models for this key: ${modelNames.join(', ')}`);
         }
      } catch (e) {}

      const chunks = [];
      const paragraphs = text.split(/\n+/);
      let currentChunk = '';
      const MAX_CHUNK_LENGTH = 3500;

      for (const p of paragraphs) {
        if ((currentChunk.length + p.length) > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = p;
        } else {
          currentChunk += (currentChunk ? '\n' : '') + p;
        }
      }
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk);
      }

      if (chunks.length === 0) {
        for (let i = 0; i < text.length; i += MAX_CHUNK_LENGTH) {
            chunks.push(text.substring(i, i + MAX_CHUNK_LENGTH));
        }
      }

      this.logger.log(`Split text into ${chunks.length} sections for processing.`);
      let allQuestions: any[] = [];

      for(let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i].trim();
        if (!chunk) continue;
        
        this.logger.log(`Processing section ${i + 1} of ${chunks.length}...`);

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
          If no questions can be extracted, return an empty array [].
          
          TEXT (Section ${i+1}):
          ${chunk}
        `;

        let retries = 5;
        let success = false;
        
        while (retries > 0 && !success) {
          try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let rawText = response.text().trim();
            
            this.logger.log(`Raw AI snippet (Sec ${i+1}): ${rawText.substring(0, 150).replace(/\n/g, ' ')}...`);
            
            let jsonText = rawText;
            const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
              jsonText = jsonMatch[1];
            } else {
              const anyMatch = rawText.match(/```\s*([\s\S]*?)\s*```/);
              if (anyMatch) jsonText = anyMatch[1];
            }
            jsonText = jsonText.trim();
            
            if (jsonText.startsWith('`')) jsonText = jsonText.replace(/^`+|`+$/g, '');

            try {
               const parsed = JSON.parse(jsonText);
               if (Array.isArray(parsed)) {
                 allQuestions = allQuestions.concat(parsed);
               } else if (parsed && typeof parsed === 'object') {
                  const possibleArray = Object.values(parsed).find(val => Array.isArray(val));
                  if (possibleArray) {
                      allQuestions = allQuestions.concat(possibleArray);
                  } else {
                      allQuestions.push(parsed);
                  }
               }
               this.logger.log(`Successfully extracted questions from section ${i+1}. Current total: ${allQuestions.length}`);
               success = true;
            } catch (jsonErr) {
               this.logger.error(`Failed to parse AI JSON for section ${i+1}: ${jsonErr.message}. JSON text was: ${jsonText.substring(0, 100)}`);
               success = true; // Mark success to proceed to next chunk so one bad string doesn't stall everything
            }
          } catch (chunkError) {
            if (chunkError.message.includes('429')) {
              this.logger.warn(`Rate limit (429) hit on section ${i+1}. Waiting 45 seconds before retrying... (Retries left: ${retries - 1})`);
              await new Promise(resolve => setTimeout(resolve, 45000));
              retries--;
            } else {
              this.logger.error(`Gemini API Error on section ${i+1}: ${chunkError.message}`);
              break; // Break the while loop if it's not a rate limit error
            }
          }
        }
        
        // Gentle staggered base delay between sequential sections to prevent triggering RPM bans
        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }

      return allQuestions;
    } catch (error) {
      this.logger.error(`Unexpected Gemini API Error: ${error.message}`);
      return [];
    }
  }
}
