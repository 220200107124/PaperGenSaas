import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  paperLimit: number; // -1 for unlimited

  @Column({ default: 0 })
  teacherLimit: number; // -1 for unlimited

  @Column('jsonb', { nullable: true })
  modulePermissions: {
    paperModule?: boolean;
    teacherModule?: boolean;
    questionModule?: boolean;
    aiModule?: boolean;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
