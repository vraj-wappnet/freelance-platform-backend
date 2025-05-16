import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { UsersService } from "../users/users.service";
export declare class MessagesService {
    private messagesRepository;
    private usersService;
    constructor(messagesRepository: Repository<Message>, usersService: UsersService);
    create(userId: string, createMessageDto: CreateMessageDto): Promise<Message>;
    findOne(id: string): Promise<Message>;
    findConversation(userId: string, recipientId: string): Promise<Message[]>;
    update(id: string, updateMessageDto: UpdateMessageDto, userId: string): Promise<Message>;
    remove(id: string, userId: string): Promise<void>;
}
