import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesGateway {
    private readonly messagesService;
    server: Server;
    private logger;
    constructor(messagesService: MessagesService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(userId: string, client: Socket): void;
    handleJoinConversation(data: {
        room: string;
    }, client: Socket): void;
    handleStartConversation(data: {
        userId: string;
        recipientId: string;
    }, client: Socket): void;
    handleMessage(data: {
        userId: string;
        createMessageDto: CreateMessageDto;
    }, client: Socket): Promise<{
        status: string;
        message: import("./entities/message.entity").Message;
        error?: undefined;
    } | {
        status: string;
        error: any;
        message?: undefined;
    }>;
}
