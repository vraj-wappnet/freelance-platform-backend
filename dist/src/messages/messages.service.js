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
const roles_enum_1 = require("../common/enums/roles.enum");
let MessagesService = class MessagesService {
    constructor(messagesRepository, usersService) {
        this.messagesRepository = messagesRepository;
        this.usersService = usersService;
    }
    async create(userId, createMessageDto) {
        const sender = await this.usersService.findById(userId);
        const recipient = await this.usersService.findById(createMessageDto.recipient_id);
        const message = this.messagesRepository.create({
            content: createMessageDto.content,
            sender,
            recipient,
        });
        return this.messagesRepository.save(message);
    }
    async findAll(userId, conversationWithId) {
        const queryBuilder = this.messagesRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.recipient', 'recipient')
            .select([
            'message',
            'sender.id',
            'sender.user_id',
            'sender.firstName',
            'sender.lastName',
            'recipient.id',
            'recipient.user_id',
            'recipient.firstName',
            'recipient.lastName',
        ])
            .where('message.sender_id = :userId OR message.recipient_id = :userId', {
            userId
        })
            .orderBy('message.createdAt', 'DESC');
        if (conversationWithId) {
            queryBuilder.andWhere('(message.sender_id = :conversationWithId AND message.recipient_id = :userId) OR ' +
                '(message.sender_id = :userId AND message.recipient_id = :conversationWithId)', { conversationWithId, userId });
        }
        return queryBuilder.getMany();
    }
    async findOne(id, userId) {
        const message = await this.messagesRepository.findOne({
            where: { id },
            relations: ['sender', 'recipient'],
        });
        if (!message) {
            throw new common_1.NotFoundException(`Message with ID "${id}" not found`);
        }
        if (message.sender.id !== userId && message.recipient.id !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this message');
        }
        return message;
    }
    async getUnreadCount(userId) {
        return this.messagesRepository.count({
            where: {
                recipient_id: userId,
                isRead: false,
            },
        });
    }
    async update(id, userId, updateMessageDto) {
        const message = await this.findOne(id, userId);
        if (updateMessageDto.isRead !== undefined && message.recipient.id !== userId) {
            throw new common_1.ForbiddenException('Only the recipient can mark a message as read');
        }
        Object.assign(message, updateMessageDto);
        return this.messagesRepository.save(message);
    }
    async remove(id, userId) {
        const message = await this.findOne(id, userId);
        const user = await this.usersService.findById(userId);
        if (message.sender.id !== userId && message.recipient.id !== userId && user.role !== roles_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You cannot delete this message');
        }
        await this.messagesRepository.remove(message);
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