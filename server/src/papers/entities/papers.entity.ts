import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Standard } from '../../standards/entities/standards.entity';
import { Subject } from '../../subjects/entities/subjects.entity';
import { User } from '../../users/entities/users.entity';
import { PaperQuestion } from './paper-questions.entity';

export enum PaperStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Entity('papers')
export class Paper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  schoolId: string;

  @Column()
  title: string;

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

  @OneToMany(() => PaperQuestion, (pq) => pq.paper)
  paperQuestions: PaperQuestion[];

  @Column()
  totalMarks: number;

  @Column({
    type: 'enum',
    enum: PaperStatus,
    default: PaperStatus.DRAFT,
  })
  status: PaperStatus;

  @Column()
  teacherId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column({ nullable: true })
  teacherName: string;

  @Column({ nullable: true })
  schoolName: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  examDate: string;

  @Column({ nullable: true })
  watermark: string;

  @Column({ nullable: true })
  footerText: string;

  @Column({ nullable: true })
  logo: string;

  @CreateDateColumn()
  createdAt: Date;
}
