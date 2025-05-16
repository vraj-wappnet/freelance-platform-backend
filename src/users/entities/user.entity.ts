import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Role } from "../../common/enums/roles.enum";
import { Project } from "../../projects/entities/project.entity";
import { Bid } from "../../bids/entities/bid.entity";
import { Contract } from "../../contracts/entities/contract.entity";
import { Message } from "../../messages/entities/message.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  user_id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.FREELANCER,
  })
  role: Role;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Exclude()
  @Column({ type: "varchar", nullable: true })
  resetOtp: string | null;

  @Exclude()
  @Column({ type: "timestamp", nullable: true })
  resetOtpExpires: Date | null;

  @Exclude()
  @Column({ type: "varchar", nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Project, (project) => project.client)
  ownedProjects: Project[];

  @OneToMany(() => Bid, (bid) => bid.freelancer)
  bids: Bid[];

  @OneToMany(() => Contract, (contract) => contract.client)
  clientContracts: Contract[];

  @OneToMany(() => Contract, (contract) => contract.freelancer)
  freelancerContracts: Contract[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  receivedMessages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  profilePhoto: string;
}
