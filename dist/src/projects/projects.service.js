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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
const users_service_1 = require("../users/users.service");
const roles_enum_1 = require("../common/enums/roles.enum");
let ProjectsService = class ProjectsService {
    constructor(projectsRepository, usersService) {
        this.projectsRepository = projectsRepository;
        this.usersService = usersService;
    }
    async create(userId, createProjectDto) {
        const user = await this.usersService.findById(userId);
        if (user.role !== roles_enum_1.Role.CLIENT) {
            throw new common_1.ForbiddenException("Only clients can create projects");
        }
        const project = this.projectsRepository.create({
            ...createProjectDto,
            client: user,
        });
        return this.projectsRepository.save(project);
    }
    async findAll(status, skills, clientId) {
        const queryBuilder = this.projectsRepository
            .createQueryBuilder("project")
            .leftJoinAndSelect("project.client", "client")
            .select([
            "project",
            "client.id",
            "client.user_id",
            "client.firstName",
            "client.lastName",
        ]);
        if (status) {
            queryBuilder.andWhere("project.status = :status", { status });
        }
        if (skills && skills.length > 0) {
            skills.forEach((skill, index) => {
                queryBuilder.andWhere(`project.skills LIKE :skill${index}`, {
                    [`skill${index}`]: `%${skill}%`,
                });
            });
        }
        if (clientId) {
            queryBuilder.andWhere("project.client_id = :clientId", { clientId });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ["client", "bids", "bids.freelancer"],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID "${id}" not found`);
        }
        return project;
    }
    async findByUserId(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found`);
        }
        return this.projectsRepository.find({
            where: { client: { id: userId } },
            relations: ["client", "bids", "bids.freelancer"],
        });
    }
    async update(id, userId, updateProjectDto) {
        const project = await this.findOne(id);
        const user = await this.usersService.findById(userId);
        if (project.client.id !== userId && user.role !== roles_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException("You can only update your own projects");
        }
        Object.assign(project, updateProjectDto);
        return this.projectsRepository.save(project);
    }
    async remove(id, userId) {
        const project = await this.findOne(id);
        const user = await this.usersService.findById(userId);
        if (project.client.id !== userId && user.role !== roles_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException("You can only delete your own projects");
        }
        await this.projectsRepository.remove(project);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map