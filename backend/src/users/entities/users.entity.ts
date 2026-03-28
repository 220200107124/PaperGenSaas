import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../schools/entities/schools.entity';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TEACHER,
  })
  role: UserRole;

  @Column({ nullable: true })
  schoolId?: string;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'schoolId' })
  school?: School;

  @Column({ nullable: true })
  subjectId?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ default: false })
  mustChangePassword: boolean;
  
  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  verificationToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  verificationTokenExpires?: Date;
  @Column({ nullable: true })
  otp?: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpires?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
