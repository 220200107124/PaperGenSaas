import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuestionsAIService {
  private readonly logger = new Logger(QuestionsAIService.name);

  constructor(private configService: ConfigService) {}

  private getOpenAIClient(): { client: OpenAI; model: string } {
    let apiKey =
      this.configService.get<string>('OPENAI_API_KEY') || process.env.OPENAI_API_KEY;

    // Resilient fallback: read directly from .env file if process.env hasn't reloaded yet
    if (!apiKey || apiKey.trim() === '') {
      try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf8');
          const match = content.match(/^OPENAI_API_KEY\s*=\s*([^\r\n#]+)/m);
          if (match && match[1]) {
            apiKey = match[1].trim();
            process.env.OPENAI_API_KEY = apiKey;
          }
        }
      } catch (e) {
        this.logger.warn(`Could not read .env directly: ${e.message}`);
      }
    }

    if (!apiKey || apiKey.trim() === '') {
      this.logger.error('OPENAI_API_KEY is missing in .env!');
      throw new BadRequestException(
        'OPENAI_API_KEY is not configured in .env. Please add your OpenAI API key (OPENAI_API_KEY=sk-...) to the backend .env file.',
      );
    }

    let model =
      this.configService.get<string>('OPENAI_MODEL') ||
      process.env.OPENAI_MODEL ||
      'gpt-4o-mini';

    if (!model || model.trim() === '') {
      try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf8');
          const match = content.match(/^OPENAI_MODEL\s*=\s*([^\r\n#]+)/m);
          if (match && match[1]) {
            model = match[1].trim();
          }
        }
      } catch (e) {}
    }

    model = model ? model.trim() : 'gpt-4o-mini';

    const client = new OpenAI({ apiKey: apiKey.trim() });
    return { client, model };
  }

  async extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
    try {
      this.logger.log(`Starting PDF extraction. Buffer size: ${fileBuffer.length} bytes.`);

      const { PDFParse } = require('pdf-parse');

      let text = '';
      if (typeof PDFParse === 'function') {
        const parser = new PDFParse({ data: fileBuffer });
        const result = await parser.getText();
        text = result.text || '';
      } else {
        const pdf = require('pdf-parse');
        if (typeof pdf === 'function') {
          const result = await pdf(fileBuffer);
          text = result.text || '';
        } else {
          throw new Error('PDFParse function not found');
        }
      }

      const trimmedText = text.trim();
      this.logger.log(`Parsed PDF successfully. Total characters: ${trimmedText.length}`);

      if (trimmedText.length === 0) {
        this.logger.warn(
          'PDF extraction yielded no readable text. Scanned or image-only PDF detected.',
        );
        throw new BadRequestException(
          'No readable text found in this PDF. Please ensure the PDF contains selectable text (not scanned images).',
        );
      }

      return trimmedText;
    } catch (error) {
      this.logger.error('Failed to parse PDF:', error.stack || error.message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Could not extract text from PDF: ${error.message}`);
    }
  }

  async generateQuestionsFromText(text: string): Promise<any[]> {
    if (!text || text.trim().length === 0) {
      this.logger.warn('No text provided for question generation.');
      return [];
    }

    const { client, model } = this.getOpenAIClient();
    this.logger.log(`Using OpenAI model [${model}] for question extraction...`);

    const MAX_CHUNK_LENGTH = 15000;
    const chunks: string[] = [];

    if (text.length <= MAX_CHUNK_LENGTH) {
      chunks.push(text);
    } else {
      const paragraphs = text.split(/\n+/);
      let currentChunk = '';
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
    }

    this.logger.log(`Split text into ${chunks.length} section(s) for OpenAI processing.`);
    const allQuestions: any[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].trim();
      if (!chunk) continue;

      this.logger.log(`Processing section ${i + 1} of ${chunks.length} (${chunk.length} chars)...`);

      const systemPrompt = `You are an expert academic question extraction and paper generator assistant.
Your task is to extract or formulate academic questions from the provided educational text.
CRITICAL INSTRUCTIONS:
1. Preserve the original language of the text (e.g. Gujarati, Hindi, English, etc.). If the input text is in Gujarati, the questionText, options, and answer MUST be in Gujarati.
2. Return ONLY a valid JSON object matching this exact schema:
{
  "questions": [
    {
      "questionText": "Question text in original language",
      "questionType": "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "SHORT" | "LONG" | "MATCH",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Array of 4 string options for MCQ, null for other question types
      "answer": "Correct answer text or option indicator",
      "marks": 1,
      "difficulty": "EASY" | "MEDIUM" | "HARD"
    }
  ]
}
3. If no explicit questions exist in the text, generate relevant academic questions covering the key concepts in the text.
4. If the text has no academic or educational content, return { "questions": [] }.`;

      try {
        const completion = await client.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Here is the text to extract questions from:\n\n${chunk}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const rawContent = completion.choices[0]?.message?.content || '{}';
        this.logger.log(`OpenAI response received for section ${i + 1}.`);

        const parsed = JSON.parse(rawContent);
        let extracted: any[] = [];

        if (Array.isArray(parsed)) {
          extracted = parsed;
        } else if (Array.isArray(parsed.questions)) {
          extracted = parsed.questions;
        } else if (Array.isArray(parsed.data)) {
          extracted = parsed.data;
        } else if (typeof parsed === 'object') {
          const possibleArr = Object.values(parsed).find((val) => Array.isArray(val));
          if (possibleArr && Array.isArray(possibleArr)) {
            extracted = possibleArr;
          }
        }

        // Normalize extracted question fields
        const normalized = extracted.map((q: any) => ({
          questionText: q.questionText || q.question || '',
          questionType: q.questionType || q.type || 'SHORT',
          options: Array.isArray(q.options) ? q.options : null,
          answer: q.answer || '',
          marks: Number(q.marks) || 1,
          difficulty: q.difficulty || 'MEDIUM',
        })).filter((q: any) => q.questionText && q.questionText.trim().length > 0);

        allQuestions.push(...normalized);
        this.logger.log(
          `Section ${i + 1} extracted ${normalized.length} questions. Total so far: ${allQuestions.length}`,
        );
      } catch (err) {
        this.logger.error(`OpenAI Error on section ${i + 1}: ${err.message}`, err.stack);
        throw new BadRequestException(`OpenAI extraction failed: ${err.message}`);
      }
    }

    return allQuestions;
  }
}
