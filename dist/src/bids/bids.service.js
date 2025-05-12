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
exports.BidsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bid_entity_1 = require("./entities/bid.entity");
const users_service_1 = require("../users/users.service");
const projects_service_1 = require("../projects/projects.service");
const roles_enum_1 = require("../common/enums/roles.enum");
const project_status_enum_1 = require("../common/enums/project-status.enum");
let BidsService = class BidsService {
    constructor(bidsRepository, usersService, projectsService) {
        this.bidsRepository = bidsRepository;
        this.usersService = usersService;
        this.projectsService = projectsService;
    }
    async create(userId, createBidDto) {
        const user = await this.usersService.findById(userId);
        if (user.role !== roles_enum_1.Role.FREELANCER) {
            throw new common_1.ForbiddenException('Only freelancers can create bids');
        }
        const project = await this.projectsService.findOne(createBidDto.project_id);
        if (project.status !== project_status_enum_1.ProjectStatus.OPEN) {
            throw new common_1.ForbiddenException('Can only bid on open projects');
        }
        const existingBid = await this.bidsRepository.findOne({
            where: {
                freelancer_id: userId,
                project_id: createBidDto.project_id,
            },
        });
        if (existingBid) {
            throw new common_1.ConflictException('You have already placed a bid for this project');
        }
        const bid = this.bidsRepository.create({
            ...createBidDto,
            freelancer: user,
            project,
        });
        return this.bidsRepository.save(bid);
    }
    async findAll(projectId, freelancerId) {
        const queryBuilder = this.bidsRepository
            .createQueryBuilder('bid')
            .leftJoinAndSelect('bid.freelancer', 'freelancer')
            .leftJoinAndSelect('bid.project', 'project')
            .select([
            'bid',
            'freelancer.id',
            'freelancer.user_id',
            'freelancer.firstName',
            'freelancer.lastName',
            'project.id',
            'project.title',
        ]);
        if (projectId) {
            queryBuilder.andWhere('bid.project_id = :projectId', { projectId });
        }
        if (freelancerId) {
            queryBuilder.andWhere('bid.freelancer_id = :freelancerId', { freelancerId });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const bid = await this.bidsRepository.findOne({
            where: { id },
            relations: ['freelancer', 'project', 'project.client'],
        });
        if (!bid) {
            throw new common_1.NotFoundException(`Bid with ID "${id}" not found`);
        }
        return bid;
    }
    async update(id, userId, updateBidDto) {
        const bid = await this.findOne(id);
        const user = await this.usersService.findById(userId);
        if (bid.freelancer.id === userId && user.role === roles_enum_1.Role.FREELANCER) {
            if (updateBidDto.amount)
                bid.amount = updateBidDto.amount;
            if (updateBidDto.deliveryTime)
                bid.deliveryTime = updateBidDto.deliveryTime;
            if (updateBidDto.proposal)
                bid.proposal = updateBidDto.proposal;
        }
        else if (bid.project.client.id === userId && user.role === roles_enum_1.Role.CLIENT) {
            if (updateBidDto.isShortlisted !== undefined) {
                bid.isShortlisted = updateBidDto.isShortlisted;
            }
        }
        else if (user.role === roles_enum_1.Role.ADMIN) {
            Object.assign(bid, updateBidDto);
        }
        else {
            throw new common_1.ForbiddenException('You do not have permission to update this bid');
        }
        return this.bidsRepository.save(bid);
    }
    async remove(id, userId) {
        const bid = await this.findOne(id);
        const user = await this.usersService.findById(userId);
        if (bid.freelancer.id !== userId && user.role !== roles_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You can only delete your own bids');
        }
        await this.bidsRepository.remove(bid);
    }
};
exports.BidsService = BidsService;
exports.BidsService = BidsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        projects_service_1.ProjectsService])
], BidsService);
//# sourceMappingURL=bids.service.js.map