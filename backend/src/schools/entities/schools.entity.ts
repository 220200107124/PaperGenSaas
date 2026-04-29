import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
