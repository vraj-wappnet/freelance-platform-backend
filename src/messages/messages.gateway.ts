
// import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Injectable, Logger } from '@nestjs/common';
// import { MessagesService } from './messages.service';
// import { CreateMessageDto } from './dto/create-message.dto';

// @WebSocketGateway({
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3001'],
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// })
// @Injectable()
// export class MessagesGateway {
//   @WebSocketServer()
//   server: Server;

//   private logger: Logger = new Logger('MessagesGateway');

//   constructor(private readonly messagesService: MessagesService) {}

//   handleConnection(client: Socket) {
//     this.logger.log(`Client connected: ${client.id}, auth: ${JSON.stringify(client.handshake.auth)}`);
//   }

//   handleDisconnect(client: Socket) {
//     this.logger.log(`Client disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('join')
//   handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
//     client.join(userId);
//     this.logger.log(`Client ${client.id} joined room ${userId}`);
//   }

//   @SubscribeMessage('joinConversation')
//   handleJoinConversation(
//     @MessageBody() data: { room: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     client.join(data.room);
//     this.logger.log(`Client ${client.id} joined conversation room ${data.room}`);
//   }

//   @SubscribeMessage('startConversation')
//   handleStartConversation(
//     @MessageBody() data: { userId: string; recipientId: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const { userId, recipientId } = data;
//     const conversationRoom = [userId, recipientId].sort().join('_');
//     this.logger.log(`Starting conversation between ${userId} and ${recipientId} in room ${conversationRoom}`);
    
//     // Join the sender to the conversation room
//     client.join(conversationRoom);
//     // Notify the receiver and join them to the room
//     this.server.to(recipientId).emit('conversationStarted', { initiatorId: userId });
//   }

//   @SubscribeMessage('sendMessage')
//   async handleMessage(
//     @MessageBody() data: { userId: string; createMessageDto: CreateMessageDto },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const { userId, createMessageDto } = data;
//     try {
//       const message = await this.messagesService.create(userId, createMessageDto);
//       const conversationRoom = [userId, createMessageDto.recipient_id].sort().join('_');
//       this.logger.log(`Broadcasting message to room ${conversationRoom}: ${JSON.stringify(message)}`);
//       this.server.to(conversationRoom).emit('receiveMessage', message);
//       client.emit('sendMessageResponse', { status: 'success', message });
//       return { status: 'success', message };
//     } catch (error) {
//       this.logger.error(`Error sending message: ${error.message}`);
//       client.emit('sendMessageResponse', { status: 'error', error: error.message });
//       return { status: 'error', error: error.message };
//     }
//   }
// }

import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@Injectable()
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessagesGateway');

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}, auth: ${JSON.stringify(client.handshake.auth)}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
    this.logger.log(`Client ${client.id} joined room ${userId}`);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.logger.log(`Client ${client.id} joined conversation room ${data.room}`);
  }

  @SubscribeMessage('startConversation')
  handleStartConversation(
    @MessageBody() data: { userId: string; recipientId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, recipientId } = data;
    const conversationRoom = [userId, recipientId].sort().join('_');
    this.logger.log(`Starting conversation between ${userId} and ${recipientId} in room ${conversationRoom}`);
    
    // Join the sender to the conversation room
    client.join(conversationRoom);
    // Notify the receiver and join them to the room
    this.server.to(recipientId).emit('conversationStarted', { initiatorId: userId });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { userId: string; createMessageDto: CreateMessageDto },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, createMessageDto } = data;
    try {
      const message = await this.messagesService.create(userId, createMessageDto);
      const conversationRoom = [userId, createMessageDto.recipient_id].sort().join('_');
      this.logger.log(`Broadcasting message to room ${conversationRoom}: ${JSON.stringify(message)}`);
      this.server.to(conversationRoom).emit('receiveMessage', message);
      client.emit('sendMessageResponse', { status: 'success', message });
      return { status: 'success', message };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('sendMessageResponse', { status: 'error', error: error.message });
      return { status: 'error', error: error.message };
    }
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @MessageBody() data: { userId: string; messageId: string; updateMessageDto: UpdateMessageDto },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, messageId, updateMessageDto } = data;
    try {
      const message = await this.messagesService.update(messageId, updateMessageDto, userId);
      const conversationRoom = [message.sender_id, message.recipient_id].sort().join('_');
      this.logger.log(`Broadcasting updated message to room ${conversationRoom}: ${JSON.stringify(message)}`);
      this.server.to(conversationRoom).emit('messageUpdated', message);
      client.emit('updateMessageResponse', { status: 'success', message });
      return { status: 'success', message };
    } catch (error) {
      this.logger.error(`Error updating message: ${error.message}`);
      client.emit('updateMessageResponse', { status: 'error', error: error.message });
      return { status: 'error', error: error.message };
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() data: { userId: string; messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, messageId } = data;
    try {
      const message = await this.messagesService.findOne(messageId);
      await this.messagesService.remove(messageId, userId);
      const conversationRoom = [message.sender_id, message.recipient_id].sort().join('_');
      this.logger.log(`Broadcasting deleted message to room ${conversationRoom}: ${messageId}`);
      this.server.to(conversationRoom).emit('messageDeleted', { messageId });
      client.emit('deleteMessageResponse', { status: 'success', messageId });
      return { status: 'success', messageId };
    } catch (error) {
      this.logger.error(`Error deleting message: ${error.message}`);
      client.emit('deleteMessageResponse', { status: 'error', error: error.message });
      return { status: 'error', error: error.message };
    }
  }
}