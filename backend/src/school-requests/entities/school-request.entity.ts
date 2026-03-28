import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum SchoolRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('school_requests')
export class SchoolRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column()
  password?: string;

  @Column({
    type: 'enum',
    enum: SchoolRequestStatus,
    default: SchoolRequestStatus.PENDING,
  })
  status: SchoolRequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
