import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('standards')
export class Standard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  schoolId?: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
