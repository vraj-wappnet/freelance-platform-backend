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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const update_message_dto_1 = require("./dto/update-message.dto");
let MessagesController = class MessagesController {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    create(req, createMessageDto) {
        return this.messagesService.create(req.user.id, createMessageDto);
    }
    findAll(req, conversationWithId) {
        return this.messagesService.findAll(req.user.id, conversationWithId);
    }
    getUnreadCount(req) {
        return this.messagesService.getUnreadCount(req.user.id);
    }
    findOne(id, req) {
        return this.messagesService.findOne(id, req.user.id);
    }
    update(id, req, updateMessageDto) {
        return this.messagesService.update(id, req.user.id, updateMessageDto);
    }
    remove(id, req) {
        return this.messagesService.remove(id, req.user.id);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new message" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The message has been successfully created.",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get all messages for the current user" }),
    (0, swagger_1.ApiQuery)({
        name: "conversationWithId",
        required: false,
        description: "Filter messages to conversation with specific user",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return all messages for the user",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("conversationWithId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("unread-count"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get count of unread messages" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return count of unread messages",
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get message by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Message ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return the message",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Message not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Update message (mark as read)" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Message ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The message has been successfully updated.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Message not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_message_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Delete message" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Message ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The message has been successfully deleted.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Message not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "remove", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)("messages"),
    (0, common_1.Controller)("messages"),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map