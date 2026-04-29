import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Paper, PaperStatus } from './entities/papers.entity';
import { PaperQuestion } from './entities/paper-questions.entity';
import { UserRole } from '../users/entities/users.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { createPaginationResponse } from '../common/utils/pagination.util';
import * as path from 'path';

const PdfPrinter = require('pdfmake/js/Printer').default;
const virtualFs = require('pdfmake/js/virtual-fs').default;
const URLResolver = require('pdfmake/js/URLResolver').default;

@Injectable()
export class PapersService {
  constructor(
    @InjectRepository(Paper)
    private papersRepository: Repository<Paper>,
    @InjectRepository(PaperQuestion)
    private paperQuestionsRepository: Repository<PaperQuestion>,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async create(createPaperDto: any, user: any): Promise<Paper> {
    const userId = user.id || user.userId;
    const schoolId = user.schoolId;

    // 1. Check if user has an active subscription
    const hasActive = await this.subscriptionsService.hasActiveSubscription({ schoolId, userId });
    
    // Super Admin is exempt
    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!hasActive) {
        throw new ForbiddenException('An active subscription is required to generate papers. Please upgrade your plan.');
      }

      // 2. Check paper limit
      const subscription = schoolId 
        ? await this.subscriptionsService.findBySchool(schoolId)
        : await this.subscriptionsService.findByUser(userId);

      if (subscription && subscription.paperLimit !== -1) {
        const paperCountQuery = this.papersRepository.createQueryBuilder('paper');
        if (schoolId) {
          paperCountQuery.where('paper.schoolId = :schoolId', { schoolId });
        } else {
          paperCountQuery.where('paper.teacherId = :userId', { userId });
        }
        
        const paperCount = await paperCountQuery.getCount();

        if (paperCount >= subscription.paperLimit) {
          throw new ForbiddenException(`Paper generation limit reached for your ${subscription.planName} plan. Please upgrade to continue.`);
        }
      }
    }


    const { paperQuestions, ...paperData } = createPaperDto;

    // Calculate total marks from paperQuestions to avoid database null constraint error
    const totalMarks = paperQuestions?.reduce((acc: number, pq: any) => acc + (pq.customMarks || 0), 0) || 0;

    const newPaper = this.papersRepository.create({
      ...paperData,
      totalMarks,
      schoolId: user.schoolId,
      teacherId: user.id || user.userId,
      status: createPaperDto.status || PaperStatus.DRAFT,
    });

    const savedPaper = (await this.papersRepository.save(newPaper)) as any;

    if (paperQuestions && Array.isArray(paperQuestions)) {
      const questionsToSave = paperQuestions.map((pq: any) => 
        this.paperQuestionsRepository.create({
          ...pq,
          paperId: (savedPaper as Paper).id,
        })
      );
      await this.paperQuestionsRepository.save(questionsToSave as any);
    }

    const finalPaper = await this.findOne((savedPaper as Paper).id);
    if (!finalPaper) throw new Error('Failed to retrieve saved paper');
    return finalPaper;
  }

  async saveDraft(createPaperDto: any, user: any) {
    return this.create({ ...createPaperDto, status: PaperStatus.DRAFT }, user);
  }

  async publish(id: string, user: any) {
    const paper = await this.findOne(id);
    if (!paper) throw new ForbiddenException('Paper not found');
    if (paper.schoolId !== user.schoolId && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('You do not have permission to publish this paper');
    }

    paper.status = PaperStatus.PUBLISHED;
    return this.papersRepository.save(paper);
  }

  async findAll(user: any, paginationDto: any) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.papersRepository.createQueryBuilder('paper')
      .leftJoinAndSelect('paper.standard', 'standard')
      .leftJoinAndSelect('paper.subject', 'subject')
      .leftJoinAndSelect('paper.teacher', 'teacher');

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (user.schoolId) {
        queryBuilder.where('paper.schoolId = :schoolId', { schoolId: user.schoolId });
      } else {
        queryBuilder.where('paper.teacherId = :teacherId', { teacherId: user.id });
      }
    }

    if (search) {
      queryBuilder.andWhere('paper.title ILIKE :search', { search: `%${search}%` });
    }

    queryBuilder.orderBy(`paper.${sortBy}`, order as any);

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findOne(id: string): Promise<Paper | null> {
    return await this.papersRepository.findOne({ 
      where: { id },
      relations: ['standard', 'subject', 'teacher', 'paperQuestions', 'paperQuestions.question']
    });
  }

  private decodeEntities(text: string): string {
    return text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9a-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  }

  private parseHtmlToPdfContent(html: string): any[] {
    if (!html) return [];
    
    // First decode entities
    let text = this.decodeEntities(html);
    
    // Convert common block tags to markup we handle or newlines
    text = text
      .replace(/<h[1-6][^>]*>/gi, '<b>')
      .replace(/<\/h[1-6]>/gi, '</b>\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n • ')
      .replace(/<\/li>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      // Remove all other tags
      .replace(/<(?!b|\/b|i|\/i|u|\/u)[^>]+>/gi, '');

    // Split by the tags we support
    const parts = text.split(/(<\/?[biu]>)/i);
    const content: any[] = [];
    
    let isBold = false;
    let isItalic = false;
    let isUnderline = false;
    
    for (const part of parts) {
      if (!part) continue;
      
      const lower = part.toLowerCase();
      if (lower === '<b>') isBold = true;
      else if (lower === '</b>') isBold = false;
      else if (lower === '<i>') isItalic = true;
      else if (lower === '</i>') isItalic = false;
      else if (lower === '<u>') isUnderline = true;
      else if (lower === '</u>') isUnderline = false;
      else {
        content.push({
          text: part,
          bold: isBold,
          italics: isItalic,
          decoration: isUnderline ? 'underline' : undefined
        });
      }
    }
    
    return content;
  }

  async download(id: string) {
    const paper = await this.findOne(id);
    if (!paper) throw new NotFoundException('Paper not found');

    const fonts = {
      Roboto: {
        normal: path.join(process.cwd(), 'fonts/Mukta-Regular.ttf'),
        bold: path.join(process.cwd(), 'fonts/Mukta-Bold.ttf'),
        italics: path.join(process.cwd(), 'fonts/Mukta-Regular.ttf'),
        bolditalics: path.join(process.cwd(), 'fonts/Mukta-Bold.ttf')
      }
    };
    const urlResolver = new URLResolver(virtualFs);
    const printer = new PdfPrinter(fonts, virtualFs, urlResolver);

    const docDefinition = {
      background: function (currentPage: number, pageSize: any) {
        if (paper.watermark) {
          return {
            text: paper.watermark,
            color: 'grey',
            opacity: 0.1,
            bold: true,
            fontSize: 60,
            alignment: 'center',
            margin: [0, pageSize.height / 2 - 30, 0, 0],
            rotate: 45
          };
        }
        return null;
      },
      content: [
        paper.logo ? { image: 'schoolLogo', width: 60, alignment: 'center', margin: [0, 0, 0, 10] } : null,
        { text: paper.schoolName || 'Institution Name', style: 'header' },
        { text: paper.title, style: 'subheader', alignment: 'center' },
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: `ધોરણ: ${paper.standard?.name || 'N/A'}`, bold: true },
                { text: `વિષય: ${paper.subject?.name || 'N/A'}`, bold: true }
              ]
            },
            {
              width: '*',
              stack: [
                { text: `સમય: ${paper.duration || 'N/A'}`, alignment: 'center', bold: true },
                { text: `તારીખ: ${paper.examDate ? new Date(paper.examDate).toLocaleDateString() : 'N/A'}`, alignment: 'center', bold: true }
              ]
            },
            {
              width: '*',
              stack: [
                { text: `કુલ ગુણ: ${paper.totalMarks || 0}`, alignment: 'right', bold: true },
                { text: `શિક્ષક: ${paper.teacherName || 'N/A'}`, alignment: 'right', bold: true }
              ]
            }
          ],
          margin: [0, 15, 0, 15]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 2 }] },
      ].filter(Boolean) as any,
      footer: function (currentPage: number, pageCount: number) {
        return {
          stack: [
            { canvas: [{ type: 'line', x1: 40, y1: 0, x2: 555, y2: 0, lineWidth: 1, lineColor: '#eeeeee' }] },
            {
              columns: [
                { text: paper.footerText || '', fontSize: 8, alignment: 'left', margin: [40, 10, 0, 0] },
                { text: `પેજ ${currentPage} / ${pageCount}`, fontSize: 8, alignment: 'right', margin: [0, 10, 40, 0] }
              ]
            }
          ]
        };
      },
      images: paper.logo ? { schoolLogo: paper.logo } : {},
      defaultStyle: {
        font: 'Roboto'
      },
      styles: {
        header: { font: 'Roboto', fontSize: 22, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        subheader: { font: 'Roboto', fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
        question: { font: 'Roboto', fontSize: 12, margin: [0, 10, 0, 5] },
      }
    };

    // Group questions by section
    const sections = ['A', 'B', 'C'];
    sections.forEach(sec => {
      const secQuestions = paper.paperQuestions.filter(pq => pq.section === sec);
      if (secQuestions.length > 0) {
        docDefinition.content.push({ text: `વિભાગ ${sec}`, style: 'subheader', alignment: 'center', margin: [0, 20, 0, 10] });
        secQuestions.sort((a, b) => a.order - b.order).forEach((pq, index) => {
          docDefinition.content.push({
            columns: [
              {
                width: '*',
                text: [
                  { text: `પ્રશ્ન ${index + 1}. `, bold: true },
                  ...this.parseHtmlToPdfContent(pq.question.questionText)
                ]
              },
              {
                width: 'auto',
                text: `[${pq.customMarks || pq.question.marks} ગુણ]`,
                bold: true,
                alignment: 'right',
                margin: [10, 0, 0, 0]
              }
            ],
            style: 'question'
          });
          
          if (pq.question.options && Array.isArray(pq.question.options)) {
            const optionsStack = pq.question.options.map((opt: string, i: number) => {
               return {
                 text: [
                   { text: `(${String.fromCharCode(65 + i)}) `, bold: true },
                   ...this.parseHtmlToPdfContent(opt)
                 ],
                 margin: [20, 2, 0, 2]
               };
            });
            docDefinition.content.push({ stack: optionsStack, margin: [0, 5, 0, 10] });
          }
        });
      }
    });

    return printer.createPdfKitDocument(docDefinition);
  }

  async remove(id: string): Promise<void> {
    await this.papersRepository.delete(id);
  }
}
