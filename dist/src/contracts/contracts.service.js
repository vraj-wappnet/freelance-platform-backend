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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_entity_1 = require("./entities/contract.entity");
const users_service_1 = require("../users/users.service");
const projects_service_1 = require("../projects/projects.service");
const contract_status_enum_1 = require("../common/enums/contract-status.enum");
const project_status_enum_1 = require("../common/enums/project-status.enum");
const roles_enum_1 = require("../common/enums/roles.enum");
const uuid_1 = require("uuid");
let ContractsService = class ContractsService {
    constructor(contractsRepository, usersService, projectsService) {
        this.contractsRepository = contractsRepository;
        this.usersService = usersService;
        this.projectsService = projectsService;
    }
    async create(userId, createContractDto) {
        if (!(0, uuid_1.validate)(userId)) {
            throw new common_1.BadRequestException("Invalid user ID: must be a valid UUID");
        }
        if (!(0, uuid_1.validate)(createContractDto.freelancer_id)) {
            throw new common_1.BadRequestException("Invalid freelancer ID: must be a valid UUID");
        }
        if (!(0, uuid_1.validate)(createContractDto.project_id)) {
            throw new common_1.BadRequestException("Invalid project ID: must be a valid UUID");
        }
        const client = await this.usersService.findById(userId);
        if (client.role !== roles_enum_1.Role.CLIENT) {
            throw new common_1.ForbiddenException("Only clients can create contracts");
        }
        const project = await this.projectsService.findOne(createContractDto.project_id);
        if (project.client.id !== userId) {
            throw new common_1.ForbiddenException("You can only create contracts for your own projects");
        }
        const existingContracts = await this.contractsRepository.find({
            where: {
                project_id: project.id,
                status: contract_status_enum_1.ContractStatus.IN_PROGRESS,
            },
        });
        if (existingContracts.length > 0) {
            throw new common_1.ConflictException("This project already has an active contract");
        }
        const freelancer = await this.usersService.findById(createContractDto.freelancer_id);
        if (freelancer.role !== roles_enum_1.Role.FREELANCER) {
            throw new common_1.ForbiddenException("The selected user is not a freelancer");
        }
        const contract = this.contractsRepository.create({
            ...createContractDto,
            client,
            freelancer,
            project,
            clientAccepted: true,
        });
        if (project.status === project_status_enum_1.ProjectStatus.OPEN) {
            project.status = project_status_enum_1.ProjectStatus.IN_PROGRESS;
            await this.projectsService.update(project.id, userId, {
                status: project_status_enum_1.ProjectStatus.IN_PROGRESS,
            });
        }
        return this.contractsRepository.save(contract);
    }
    async findAll(clientId, freelancerId, projectId, status) {
        if (clientId && !(0, uuid_1.validate)(clientId)) {
            throw new common_1.BadRequestException("Invalid client ID: must be a valid UUID");
        }
        if (freelancerId && !(0, uuid_1.validate)(freelancerId)) {
            throw new common_1.BadRequestException("Invalid freelancer ID: must be a valid UUID");
        }
        if (projectId && !(0, uuid_1.validate)(projectId)) {
            throw new common_1.BadRequestException("Invalid project ID: must be a valid UUID");
        }
        const queryBuilder = this.contractsRepository
            .createQueryBuilder("contract")
            .leftJoinAndSelect("contract.client", "client")
            .leftJoinAndSelect("contract.freelancer", "freelancer")
            .leftJoinAndSelect("contract.project", "project")
            .select([
            "contract",
            "client.id",
            "client.user_id",
            "client.firstName",
            "client.lastName",
            "freelancer.id",
            "freelancer.user_id",
            "freelancer.firstName",
            "freelancer.lastName",
            "project.id",
            "project.title",
        ]);
        if (clientId) {
            queryBuilder.andWhere("contract.client_id = :clientId", { clientId });
        }
        if (freelancerId) {
            queryBuilder.andWhere("contract.freelancer_id = :freelancerId", {
                freelancerId,
            });
        }
        if (projectId) {
            queryBuilder.andWhere("contract.project_id = :projectId", { projectId });
        }
        if (status) {
            queryBuilder.andWhere("contract.status = :status", { status });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        if (!(0, uuid_1.validate)(id)) {
            throw new common_1.BadRequestException("Invalid contract ID: must be a valid UUID");
        }
        const contract = await this.contractsRepository.findOne({
            where: { id },
            relations: ["client", "freelancer", "project", "milestones"],
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with ID "${id}" not found`);
        }
        return contract;
    }
    async findByUser(userId) {
        if (!(0, uuid_1.validate)(userId)) {
            throw new common_1.BadRequestException("Invalid user ID: must be a valid UUID");
        }
        const queryBuilder = this.contractsRepository
            .createQueryBuilder("contract")
            .leftJoinAndSelect("contract.client", "client")
            .leftJoinAndSelect("contract.freelancer", "freelancer")
            .leftJoinAndSelect("contract.project", "project")
            .select([
            "contract.id",
            "contract.amount",
            "contract.description",
            "contract.startDate",
            "contract.endDate",
            "contract.status",
            "contract.clientAccepted",
            "contract.freelancerAccepted",
            "contract.client_id",
            "contract.freelancer_id",
            "contract.project_id",
            "contract.createdAt",
            "contract.updatedAt",
            "client.id",
            "client.user_id",
            "client.firstName",
            "client.lastName",
            "freelancer.id",
            "freelancer.user_id",
            "freelancer.firstName",
            "freelancer.lastName",
            "project.id",
            "project.title",
        ])
            .where("contract.client_id = :userId", { userId })
            .orWhere("contract.freelancer_id = :userId", { userId });
        const contracts = await queryBuilder.getMany();
        return contracts;
    }
    async update(id, userId, updateContractDto) {
        if (!(0, uuid_1.validate)(id)) {
            throw new common_1.BadRequestException("Invalid contract ID: must be a valid UUID");
        }
        if (!(0, uuid_1.validate)(userId)) {
            throw new common_1.BadRequestException("Invalid user ID: must be a valid UUID");
        }
        const contract = await this.findOne(id);
        const user = await this.usersService.findById(userId);
        const isClient = contract.client.id === userId;
        const isFreelancer = contract.freelancer.id === userId;
        const isAdmin = user.role === roles_enum_1.Role.ADMIN;
        if (!isClient && !isFreelancer && !isAdmin) {
            throw new common_1.ForbiddenException("You cannot update this contract");
        }
        if (isClient) {
            if (updateContractDto.clientAccepted !== undefined) {
                contract.clientAccepted = updateContractDto.clientAccepted;
            }
            if (updateContractDto.amount)
                contract.amount = updateContractDto.amount;
            if (updateContractDto.description)
                contract.description = updateContractDto.description;
            if (updateContractDto.startDate)
                contract.startDate = new Date(updateContractDto.startDate);
            if (updateContractDto.endDate)
                contract.endDate = new Date(updateContractDto.endDate);
        }
        if (isFreelancer) {
            if (updateContractDto.freelancerAccepted !== undefined) {
                contract.freelancerAccepted = updateContractDto.freelancerAccepted;
            }
            if (updateContractDto.amount ||
                updateContractDto.description ||
                updateContractDto.startDate ||
                updateContractDto.endDate) {
                throw new common_1.ForbiddenException("Freelancers can only update freelancerAccepted");
            }
        }
        if (isAdmin) {
            Object.assign(contract, {
                ...updateContractDto,
                startDate: updateContractDto.startDate
                    ? new Date(updateContractDto.startDate)
                    : contract.startDate,
                endDate: updateContractDto.endDate
                    ? new Date(updateContractDto.endDate)
                    : contract.endDate,
            });
        }
        if (contract.clientAccepted && contract.freelancerAccepted) {
            contract.status = contract_status_enum_1.ContractStatus.APPROVED;
            await this.projectsService.update(contract.project.id, contract.client.id, {
                status: project_status_enum_1.ProjectStatus.IN_PROGRESS,
            });
        }
        if (isAdmin && updateContractDto.status) {
            contract.status = updateContractDto.status;
            if (updateContractDto.status === contract_status_enum_1.ContractStatus.COMPLETED) {
                await this.projectsService.update(contract.project.id, contract.client.id, {
                    status: project_status_enum_1.ProjectStatus.COMPLETED,
                });
            }
            else if (updateContractDto.status === contract_status_enum_1.ContractStatus.CANCELLED) {
                await this.projectsService.update(contract.project.id, contract.client.id, {
                    status: project_status_enum_1.ProjectStatus.CANCELLED,
                });
            }
        }
        return this.contractsRepository.save(contract);
    }
    async remove(id, userId) {
        if (!(0, uuid_1.validate)(id)) {
            throw new common_1.BadRequestException("Invalid contract ID: must be a valid UUID");
        }
        if (!(0, uuid_1.validate)(userId)) {
            throw new common_1.BadRequestException("Invalid user ID: must be a valid UUID");
        }
        const contract = await this.findOne(id);
        const user = await this.usersService.findById(userId);
        if (contract.client.id !== userId && user.role !== roles_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException("Only the client or an admin can delete a contract");
        }
        if (contract.status !== contract_status_enum_1.ContractStatus.PROPOSAL) {
            throw new common_1.ForbiddenException("Can only delete contracts in proposal status");
        }
        await this.contractsRepository.remove(contract);
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        projects_service_1.ProjectsService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map