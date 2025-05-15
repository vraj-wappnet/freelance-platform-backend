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
exports.BidsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bids_service_1 = require("./bids.service");
const create_bid_dto_1 = require("./dto/create-bid.dto");
const update_bid_dto_1 = require("./dto/update-bid.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/enums/roles.enum");
let BidsController = class BidsController {
    constructor(bidsService) {
        this.bidsService = bidsService;
    }
    create(req, createBidDto) {
        return this.bidsService.create(req.user.id, createBidDto);
    }
    findByUserId(req) {
        return this.bidsService.findByUserId(req.user.id);
    }
    findAll(projectId, freelancerId) {
        return this.bidsService.findAll(projectId, freelancerId);
    }
    findOne(id) {
        return this.bidsService.findOne(id);
    }
    update(id, req, updateBidDto) {
        return this.bidsService.update(id, req.user.id, updateBidDto);
    }
    remove(id, req) {
        return this.bidsService.remove(id, req.user.id);
    }
};
exports.BidsController = BidsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.FREELANCER),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new bid" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The bid has been successfully created.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "You have already placed a bid for this project.",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_bid_dto_1.CreateBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("user"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get bids by user ID (freelancer or client)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return all bids for the user",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get all bids with optional filtering" }),
    (0, swagger_1.ApiQuery)({
        name: "projectId",
        required: false,
        description: "Filter by project ID",
    }),
    (0, swagger_1.ApiQuery)({
        name: "freelancerId",
        required: false,
        description: "Filter by freelancer ID",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return all bids matching criteria",
    }),
    __param(0, (0, common_1.Query)("projectId")),
    __param(1, (0, common_1.Query)("freelancerId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get bid by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Bid ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return the bid",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bid not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Update bid" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Bid ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The bid has been successfully updated.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bid not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_bid_dto_1.UpdateBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Delete bid" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Bid ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The bid has been successfully deleted.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Bid not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "remove", null);
exports.BidsController = BidsController = __decorate([
    (0, swagger_1.ApiTags)("bids"),
    (0, common_1.Controller)("bids"),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [bids_service_1.BidsService])
], BidsController);
//# sourceMappingURL=bids.controller.js.map