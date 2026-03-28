import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../schools/entities/schools.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @Column()
  planName: string;

  @Column({ default: 0 })
  paperLimit: number;

  @Column({ default: 0 })
  teacherLimit: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'jsonb', nullable: true })
  modulePermissions: any;

  @CreateDateColumn()
  createdAt: Date;
}
