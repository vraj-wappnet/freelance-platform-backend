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
exports.MilestonesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const milestone_entity_1 = require("./entities/milestone.entity");
const contract_status_enum_1 = require("../common/enums/contract-status.enum");
const milestone_status_enum_1 = require("../common/enums/milestone-status.enum");
const roles_enum_1 = require("../common/enums/roles.enum");
const users_service_1 = require("../users/users.service");
let MilestonesService = class MilestonesService {
    constructor(milestonesRepository, usersService) {
        this.milestonesRepository = milestonesRepository;
        this.usersService = usersService;
    }
    async create(userId, createMilestoneDto) {
        const user = await this.usersService.findById(userId);
        const contract = await this.milestonesRepository.manager
            .getRepository("Contract")
            .findOne({
            where: { id: createMilestoneDto.contract_id },
            relations: ["client", "freelancer"],
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with ID "${createMilestoneDto.contract_id}" not found`);
        }
        if (contract.client.id !== userId && user.role !== roles_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException("Only the client or an admin can create milestones");
        }
        if (![contract_status_enum_1.ContractStatus.APPROVED, contract_status_enum_1.ContractStatus.IN_PROGRESS].includes(contract.status)) {
            throw new common_1.BadRequestException("Can only add milestones to approved or in-progress contracts");
        }
        const milestone = this.milestonesRepository.create({
            ...createMilestoneDto,
            contract: { id: contract.id },
            dueDate: createMilestoneDto.dueDate
                ? new Date(createMilestoneDto.dueDate)
                : undefined,
        });
        return this.milestonesRepository.save(milestone);
    }
    async findAll(contractId, status) {
        const queryBuilder = this.milestonesRepository
            .createQueryBuilder("milestone")
            .leftJoinAndSelect("milestone.contract", "contract")
            .select([
            "milestone",
            "contract.id",
            "contract.amount",
            "contract.status",
        ]);
        if (contractId) {
            queryBuilder.andWhere("milestone.contract_id = :contractId", {
                contractId,
            });
        }
        if (status) {
            queryBuilder.andWhere("milestone.status = :status", { status });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const milestone = await this.milestonesRepository.findOne({
            where: { id },
            relations: ["contract", "contract.client", "contract.freelancer"],
        });
        if (!milestone) {
            throw new common_1.NotFoundException(`Milestone with ID "${id}" not found`);
        }
        return milestone;
    }
    async update(id, userId, updateMilestoneDto) {
        const milestone = await this.findOne(id);
        const user = await this.usersService.findById(userId);
        const isClient = milestone.contract.client.id === userId;
        const isFreelancer = milestone.contract.freelancer.id === userId;
        const isAdmin = user.role === roles_enum_1.Role.ADMIN;
        if (!isClient && !isFreelancer && !isAdmin) {
            throw new common_1.ForbiddenException("You cannot update this milestone");
        }
        const updateFields = {};
        if (isClient || isAdmin) {
            if (updateMilestoneDto.title)
                updateFields.title = updateMilestoneDto.title;
            if (updateMilestoneDto.description)
                updateFields.description = updateMilestoneDto.description;
            if (updateMilestoneDto.amount)
                updateFields.amount = updateMilestoneDto.amount;
            if (updateMilestoneDto.dueDate)
                updateFields.dueDate = new Date(updateMilestoneDto.dueDate);
        }
        if (updateMilestoneDto.status) {
            const currentStatus = milestone.status;
            const newStatus = updateMilestoneDto.status;
            if (isClient) {
                if (currentStatus === milestone_status_enum_1.MilestoneStatus.REVIEW &&
                    newStatus === milestone_status_enum_1.MilestoneStatus.APPROVED) {
                    updateFields.status = milestone_status_enum_1.MilestoneStatus.APPROVED;
                }
                else if (currentStatus === milestone_status_enum_1.MilestoneStatus.APPROVED &&
                    newStatus === milestone_status_enum_1.MilestoneStatus.PAID) {
                    updateFields.status = milestone_status_enum_1.MilestoneStatus.PAID;
                    updateFields.paymentDate = new Date();
                }
                else {
                    throw new common_1.ForbiddenException(`Client cannot change milestone status from ${currentStatus} to ${newStatus}`);
                }
            }
            if (isFreelancer) {
                if (currentStatus === milestone_status_enum_1.MilestoneStatus.PENDING &&
                    newStatus === milestone_status_enum_1.MilestoneStatus.IN_PROGRESS) {
                    updateFields.status = milestone_status_enum_1.MilestoneStatus.IN_PROGRESS;
                }
                else if (currentStatus === milestone_status_enum_1.MilestoneStatus.IN_PROGRESS &&
                    newStatus === milestone_status_enum_1.MilestoneStatus.REVIEW) {
                    if (!updateMilestoneDto.completionNote) {
                        throw new common_1.BadRequestException("Completion note is required when submitting for review");
                    }
                    updateFields.status = milestone_status_enum_1.MilestoneStatus.REVIEW;
                    updateFields.completionNote = updateMilestoneDto.completionNote;
                }
                else {
                    throw new common_1.ForbiddenException(`Freelancer cannot change milestone status from ${currentStatus} to ${newStatus}`);
                }
            }
            if (isAdmin) {
                updateFields.status = newStatus;
                if (newStatus === milestone_status_enum_1.MilestoneStatus.PAID) {
                    updateFields.paymentDate = updateMilestoneDto.paymentDate
                        ? new Date(updateMilestoneDto.paymentDate)
                        : new Date();
                }
                if (updateMilestoneDto.completionNote) {
                    updateFields.completionNote = updateMilestoneDto.completionNote;
                }
            }
        }
        else {
            if (isFreelancer &&
                [milestone_status_enum_1.MilestoneStatus.IN_PROGRESS, milestone_status_enum_1.MilestoneStatus.REVIEW].includes(milestone.status) &&
                updateMilestoneDto.completionNote) {
                updateFields.completionNote = updateMilestoneDto.completionNote;
            }
        }
        if (Object.keys(updateFields).length === 0) {
            throw new common_1.BadRequestException("No valid fields to update");
        }
        Object.assign(milestone, updateFields);
        return this.milestonesRepository.save(milestone);
    }
    async remove(id, userId) {
        const milestone = await this.findOne(id);
        const user = await this.usersService.findById(userId);
        if (milestone.contract.client.id !== userId && user.role !== roles_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException("Only the client or an admin can delete a milestone");
        }
        if (milestone.status !== milestone_status_enum_1.MilestoneStatus.PENDING) {
            throw new common_1.ForbiddenException("Can only delete pending milestones");
        }
        await this.milestonesRepository.remove(milestone);
    }
};
exports.MilestonesService = MilestonesService;
exports.MilestonesService = MilestonesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(milestone_entity_1.Milestone)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], MilestonesService);
//# sourceMappingURL=milestones.service.js.map