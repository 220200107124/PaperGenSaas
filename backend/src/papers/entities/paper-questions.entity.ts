import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Paper } from './papers.entity';
import { Question } from '../../questions/entities/questions.entity';

@Entity('paper_questions')
export class PaperQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paperId: string;

  @ManyToOne(() => Paper, (paper) => paper.paperQuestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paperId' })
  paper: Paper;

  @Column()
  questionId: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column()
  section: string;

  @Column()
  customMarks: number;

  @Column()
  order: number;
}
