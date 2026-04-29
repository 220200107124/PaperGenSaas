import { SourceType, QuestionType } from '../entities/questions.entity';

export class CreateQuestionDto {
  schoolId?: string;
  standardId: string;
  subjectId: string;
  chapterId: string;
  questionType: QuestionType;
  questionText: string;
  options?: any;
  answer?: any;
  marks: number;
  difficulty: string;
  sourceType: SourceType;
  createdBy?: string;
}
