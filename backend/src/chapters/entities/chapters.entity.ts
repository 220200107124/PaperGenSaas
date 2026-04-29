import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Subject } from '../../subjects/entities/subjects.entity';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  subjectId: string;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
