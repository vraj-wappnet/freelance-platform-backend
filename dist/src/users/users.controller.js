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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/enums/roles.enum");
const user_entity_1 = require("./entities/user.entity");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll() {
        return this.usersService.findAll();
    }
    findByRole(role) {
        return this.usersService.findByRole(role);
    }
    findOne(id) {
        return this.usersService.findById(id);
    }
    findByUserId(userId) {
        return this.usersService.findByUserId(userId);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new user" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The user has been successfully created.",
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid input data." }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Email already exists." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get all users" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return all users",
        type: [user_entity_1.User],
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("by-role"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get users by role" }),
    (0, swagger_1.ApiQuery)({
        name: "role",
        required: true,
        enum: ["admin", "client", "freelancer"],
        description: "Filter users by role (e.g., client, freelancer)",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return users matching the specified role",
        type: [user_entity_1.User],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid role provided." }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "No users found for the specified role.",
    }),
    __param(0, (0, common_1.Query)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get user by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "User ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return the user",
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found." }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)("user-id/:userId"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get user by user_id" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "Public User ID (user_id)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return the user",
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found." }),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Update user" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "User ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The user has been successfully updated.",
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found." }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Delete user" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "User ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The user has been successfully deleted.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found." }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)("users"),
    (0, common_1.Controller)("users"),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map