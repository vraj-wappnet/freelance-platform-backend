import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @Column()
  sender_id: string;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: "recipient_id" })
  recipient: User;

  @Column()
  recipient_id: string;

  @CreateDateColumn()
  createdAt: Date;
}
