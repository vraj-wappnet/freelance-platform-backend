import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { UserRequest } from "../common/interfaces/user-request.interface";
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(req: UserRequest, createMessageDto: CreateMessageDto): Promise<import("./entities/message.entity").Message>;
    findAll(req: UserRequest, conversationWithId?: string): Promise<import("./entities/message.entity").Message[]>;
    getUnreadCount(req: UserRequest): Promise<number>;
    findOne(id: string, req: UserRequest): Promise<import("./entities/message.entity").Message>;
    update(id: string, req: UserRequest, updateMessageDto: UpdateMessageDto): Promise<import("./entities/message.entity").Message>;
    remove(id: string, req: UserRequest): Promise<void>;
}
