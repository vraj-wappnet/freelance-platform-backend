import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Milestone } from '../../milestones/entities/milestone.entity';
import { ContractStatus } from '../../common/enums/contract-status.enum';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PROPOSAL,
  })
  status: ContractStatus;

  @Column({ default: false })
  clientAccepted: boolean;

  @Column({ default: false })
  freelancerAccepted: boolean;

  @ManyToOne(() => User, (user) => user.clientContracts)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column()
  client_id: string;

  @ManyToOne(() => User, (user) => user.freelancerContracts)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: User;

  @Column()
  freelancer_id: string;

  @ManyToOne(() => Project, (project) => project.contracts)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  project_id: string;

  @OneToMany(() => Milestone, (milestone) => milestone.contract)
  milestones: Milestone[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}