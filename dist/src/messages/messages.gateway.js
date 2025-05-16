"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
let MessagesGateway = class MessagesGateway {
    constructor(messagesService) {
        this.messagesService = messagesService;
        this.logger = new common_1.Logger('MessagesGateway');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}, auth: ${JSON.stringify(client.handshake.auth)}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleJoin(userId, client) {
        client.join(userId);
        this.logger.log(`Client ${client.id} joined room ${userId}`);
    }
    handleJoinConversation(data, client) {
        client.join(data.room);
        this.logger.log(`Client ${client.id} joined conversation room ${data.room}`);
    }
    handleStartConversation(data, client) {
        const { userId, recipientId } = data;
        const conversationRoom = [userId, recipientId].sort().join('_');
        this.logger.log(`Starting conversation between ${userId} and ${recipientId} in room ${conversationRoom}`);
        client.join(conversationRoom);
        this.server.to(recipientId).emit('conversationStarted', { initiatorId: userId });
    }
    async handleMessage(data, client) {
        const { userId, createMessageDto } = data;
        try {
            const message = await this.messagesService.create(userId, createMessageDto);
            const conversationRoom = [userId, createMessageDto.recipient_id].sort().join('_');
            this.logger.log(`Broadcasting message to room ${conversationRoom}: ${JSON.stringify(message)}`);
            this.server.to(conversationRoom).emit('receiveMessage', message);
            client.emit('sendMessageResponse', { status: 'success', message });
            return { status: 'success', message };
        }
        catch (error) {
            this.logger.error(`Error sending message: ${error.message}`);
            client.emit('sendMessageResponse', { status: 'error', error: error.message });
            return { status: 'error', error: error.message };
        }
    }
    async handleUpdateMessage(data, client) {
        const { userId, messageId, updateMessageDto } = data;
        try {
            const message = await this.messagesService.update(messageId, updateMessageDto, userId);
            const conversationRoom = [message.sender_id, message.recipient_id].sort().join('_');
            this.logger.log(`Broadcasting updated message to room ${conversationRoom}: ${JSON.stringify(message)}`);
            this.server.to(conversationRoom).emit('messageUpdated', message);
            client.emit('updateMessageResponse', { status: 'success', message });
            return { status: 'success', message };
        }
        catch (error) {
            this.logger.error(`Error updating message: ${error.message}`);
            client.emit('updateMessageResponse', { status: 'error', error: error.message });
            return { status: 'error', error: error.message };
        }
    }
    async handleDeleteMessage(data, client) {
        const { userId, messageId } = data;
        try {
            const message = await this.messagesService.findOne(messageId);
            await this.messagesService.remove(messageId, userId);
            const conversationRoom = [message.sender_id, message.recipient_id].sort().join('_');
            this.logger.log(`Broadcasting deleted message to room ${conversationRoom}: ${messageId}`);
            this.server.to(conversationRoom).emit('messageDeleted', { messageId });
            client.emit('deleteMessageResponse', { status: 'success', messageId });
            return { status: 'success', messageId };
        }
        catch (error) {
            this.logger.error(`Error deleting message: ${error.message}`);
            client.emit('deleteMessageResponse', { status: 'error', error: error.message });
            return { status: 'error', error: error.message };
        }
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleStartConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleUpdateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleDeleteMessage", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map