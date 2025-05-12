import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  deliveryTime: number;

  @Column({ type: 'text' })
  proposal: string;

  @Column({ default: false })
  isShortlisted: boolean;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: User;

  @Column()
  freelancer_id: string;

  @ManyToOne(() => Project, (project) => project.bids)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  project_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}