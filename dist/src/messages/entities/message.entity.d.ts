import { User } from "../../users/entities/user.entity";
export declare class Message {
    id: string;
    content: string;
    sender: User;
    sender_id: string;
    recipient: User;
    recipient_id: string;
    createdAt: Date;
}
