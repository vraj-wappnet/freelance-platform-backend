import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { UserRequest } from "../common/interfaces/user-request.interface";
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(req: UserRequest, createMessageDto: CreateMessageDto): Promise<import("./entities/message.entity").Message>;
    getConversation(req: UserRequest, userId: string, recipientId: string): Promise<import("./entities/message.entity").Message[]>;
    update(req: UserRequest, id: string, updateMessageDto: UpdateMessageDto): Promise<import("./entities/message.entity").Message>;
    delete(req: UserRequest, id: string): Promise<void>;
}
