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
exports.ContractsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_service_1 = require("./contracts.service");
const create_contract_dto_1 = require("./dto/create-contract.dto");
const update_contract_dto_1 = require("./dto/update-contract.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/enums/roles.enum");
const contract_status_enum_1 = require("../common/enums/contract-status.enum");
let ContractsController = class ContractsController {
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    create(req, createContractDto) {
        return this.contractsService.create(req.user.id, createContractDto);
    }
    findAll(clientId, freelancerId, projectId, status) {
        return this.contractsService.findAll(clientId, freelancerId, projectId, status);
    }
    findOne(id) {
        return this.contractsService.findOne(id);
    }
    update(id, req, updateContractDto) {
        return this.contractsService.update(id, req.user.id, updateContractDto);
    }
    remove(id, req) {
        return this.contractsService.remove(id, req.user.id);
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.CLIENT),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new contract" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The contract has been successfully created.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Conflict - project already has an active contract.",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contract_dto_1.CreateContractDto]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get all contracts with optional filtering" }),
    (0, swagger_1.ApiQuery)({
        name: "clientId",
        required: false,
        description: "Filter by client ID",
    }),
    (0, swagger_1.ApiQuery)({
        name: "freelancerId",
        required: false,
        description: "Filter by freelancer ID",
    }),
    (0, swagger_1.ApiQuery)({
        name: "projectId",
        required: false,
        description: "Filter by project ID",
    }),
    (0, swagger_1.ApiQuery)({
        name: "status",
        required: false,
        description: "Filter by contract status",
        enum: contract_status_enum_1.ContractStatus,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return all contracts matching criteria",
    }),
    __param(0, (0, common_1.Query)("clientId")),
    __param(1, (0, common_1.Query)("freelancerId")),
    __param(2, (0, common_1.Query)("projectId")),
    __param(3, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get contract by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Contract ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return the contract",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Contract not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Update contract" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Contract ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The contract has been successfully updated.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Contract not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_contract_dto_1.UpdateContractDto]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Delete contract" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Contract ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The contract has been successfully deleted.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Forbidden - only client or admin can delete a contract.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Contract not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "remove", null);
exports.ContractsController = ContractsController = __decorate([
    (0, swagger_1.ApiTags)("contracts"),
    (0, common_1.Controller)("contracts"),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map