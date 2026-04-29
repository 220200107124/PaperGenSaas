import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Standard } from '../../standards/entities/standards.entity';
import { Subject } from '../../subjects/entities/subjects.entity';
import { Chapter } from '../../chapters/entities/chapters.entity';

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_BLANK = 'FILL_BLANK',
  SHORT = 'SHORT',
  LONG = 'LONG',
  MATCH = 'MATCH',
}

export enum SourceType {
  GLOBAL = 'GLOBAL',
  SCHOOL = 'SCHOOL',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  schoolId?: string;

  @Column()
  standardId: string;

  @ManyToOne(() => Standard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'standardId' })
  standard: Standard;

  @Column()
  subjectId: string;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @Column()
  chapterId: string;

  @ManyToOne(() => Chapter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapterId' })
  chapter: Chapter;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  questionType: QuestionType;

  @Column('text')
  questionText: string;

  @Column('jsonb', { nullable: true })
  options: any;

  @Column('jsonb')
  answer: any;

  @Column()
  marks: number;

  @Column()
  difficulty: string;

  @Column({
    type: 'enum',
    enum: SourceType,
    default: SourceType.GLOBAL,
  })
  sourceType: SourceType;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
