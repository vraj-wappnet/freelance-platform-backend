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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
const users_service_1 = require("../users/users.service");
let MessagesService = class MessagesService {
    constructor(messagesRepository, usersService) {
        this.messagesRepository = messagesRepository;
        this.usersService = usersService;
    }
    async create(userId, createMessageDto) {
        const sender = await this.usersService.findById(userId);
        const recipient = await this.usersService.findById(createMessageDto.recipient_id);
        if (!sender || !recipient) {
            throw new common_1.NotFoundException("Sender or recipient not found");
        }
        const message = this.messagesRepository.create({
            content: createMessageDto.content,
            sender,
            recipient,
            sender_id: userId,
            recipient_id: createMessageDto.recipient_id,
        });
        return this.messagesRepository.save(message);
    }
    async findOne(id) {
        const message = await this.messagesRepository.findOne({
            where: { id },
            relations: ["sender", "recipient"],
        });
        if (!message) {
            throw new common_1.NotFoundException("Message not found");
        }
        return message;
    }
    async findConversation(userId, recipientId) {
        return this.messagesRepository
            .createQueryBuilder("message")
            .leftJoinAndSelect("message.sender", "sender")
            .leftJoinAndSelect("message.recipient", "recipient")
            .where("((message.sender_id = :userId AND message.recipient_id = :recipientId) OR " +
            "(message.sender_id = :recipientId AND message.recipient_id = :userId))", { userId, recipientId })
            .orderBy("message.createdAt", "ASC")
            .getMany();
    }
    async update(id, updateMessageDto, userId) {
        const message = await this.findOne(id);
        if (message.sender_id !== userId) {
            throw new common_1.ForbiddenException("You can only update your own messages");
        }
        Object.assign(message, updateMessageDto);
        return this.messagesRepository.save(message);
    }
    async remove(id, userId) {
        const message = await this.findOne(id);
        if (message.sender_id !== userId) {
            throw new common_1.ForbiddenException("You can only delete your own messages");
        }
        await this.messagesRepository.delete(id);
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map