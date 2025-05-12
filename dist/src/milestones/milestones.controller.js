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
exports.MilestonesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const milestones_service_1 = require("./milestones.service");
const create_milestone_dto_1 = require("./dto/create-milestone.dto");
const update_milestone_dto_1 = require("./dto/update-milestone.dto");
const milestone_status_enum_1 = require("../common/enums/milestone-status.enum");
let MilestonesController = class MilestonesController {
    constructor(milestonesService) {
        this.milestonesService = milestonesService;
    }
    create(req, createMilestoneDto) {
        return this.milestonesService.create(req.user.id, createMilestoneDto);
    }
    findAll(contractId, status) {
        return this.milestonesService.findAll(contractId, status);
    }
    findOne(id) {
        return this.milestonesService.findOne(id);
    }
    update(id, req, updateMilestoneDto) {
        return this.milestonesService.update(id, req.user.id, updateMilestoneDto);
    }
    remove(id, req) {
        return this.milestonesService.remove(id, req.user.id);
    }
};
exports.MilestonesController = MilestonesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new milestone" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The milestone has been successfully created.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request." }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_milestone_dto_1.CreateMilestoneDto]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get all milestones with optional filtering" }),
    (0, swagger_1.ApiQuery)({
        name: "contractId",
        required: false,
        description: "Filter by contract ID",
    }),
    (0, swagger_1.ApiQuery)({
        name: "status",
        required: false,
        description: "Filter by milestone status",
        enum: milestone_status_enum_1.MilestoneStatus,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return all milestones matching criteria",
    }),
    __param(0, (0, common_1.Query)("contractId")),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get milestone by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Milestone ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return the milestone",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Milestone not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Update milestone" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Milestone ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The milestone has been successfully updated.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Milestone not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_milestone_dto_1.UpdateMilestoneDto]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Delete milestone" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Milestone ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The milestone has been successfully deleted.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Forbidden - only client or admin can delete a milestone.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Milestone not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MilestonesController.prototype, "remove", null);
exports.MilestonesController = MilestonesController = __decorate([
    (0, swagger_1.ApiTags)("milestones"),
    (0, common_1.Controller)("milestones"),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [milestones_service_1.MilestonesService])
], MilestonesController);
//# sourceMappingURL=milestones.controller.js.map