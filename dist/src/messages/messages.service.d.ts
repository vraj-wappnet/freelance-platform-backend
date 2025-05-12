import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UsersService } from '../users/users.service';
export declare class MessagesService {
    private messagesRepository;
    private usersService;
    constructor(messagesRepository: Repository<Message>, usersService: UsersService);
    create(userId: string, createMessageDto: CreateMessageDto): Promise<Message>;
    findAll(userId: string, conversationWithId?: string): Promise<Message[]>;
    findOne(id: string, userId: string): Promise<Message>;
    getUnreadCount(userId: string): Promise<number>;
    update(id: string, userId: string, updateMessageDto: UpdateMessageDto): Promise<Message>;
    remove(id: string, userId: string): Promise<void>;
}
