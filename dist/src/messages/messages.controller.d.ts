import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UserRequest } from "../common/interfaces/user-request.interface";
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(req: UserRequest, createMessageDto: CreateMessageDto): Promise<import("./entities/message.entity").Message>;
    getConversation(req: UserRequest, userId: string, recipientId: string): Promise<import("./entities/message.entity").Message[]>;
}
