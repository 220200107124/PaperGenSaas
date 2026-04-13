import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../schools/entities/schools.entity';
import { User } from '../../users/entities/users.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  schoolId: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @Column({ default: 'school' })
  type: string; // 'school' or 'teacher'

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  planName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ default: 0 })
  paperLimit: number;

  @Column({ default: 0 })
  teacherLimit: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'jsonb', nullable: true })
  modulePermissions: any;

  @Column({ nullable: true })
  razorpayOrderId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ nullable: true })
  razorpaySignature: string;

  @Column({ nullable: true })
  paypalOrderId: string;

  @Column({ nullable: true })
  paypalCaptureId: string;

  @CreateDateColumn()
  createdAt: Date;
}

