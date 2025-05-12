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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/enums/roles.enum");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(req, createProjectDto) {
        return this.projectsService.create(req.user.id, createProjectDto);
    }
    findAll(status, skillsString, clientId) {
        const skills = skillsString ? skillsString.split(",") : undefined;
        return this.projectsService.findAll(status, skills, clientId);
    }
    findOne(id) {
        return this.projectsService.findOne(id);
    }
    update(id, req, updateProjectDto) {
        return this.projectsService.update(id, req.user.id, updateProjectDto);
    }
    remove(id, req) {
        return this.projectsService.remove(id, req.user.id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.CLIENT, roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new project" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The project has been successfully created.",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get all projects with optional filtering" }),
    (0, swagger_1.ApiQuery)({
        name: "status",
        required: false,
        description: "Filter by project status",
    }),
    (0, swagger_1.ApiQuery)({
        name: "skills",
        required: false,
        description: "Filter by skills (comma-separated)",
    }),
    (0, swagger_1.ApiQuery)({
        name: "clientId",
        required: false,
        description: "Filter by client ID",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return all projects matching criteria",
    }),
    __param(0, (0, common_1.Query)("status")),
    __param(1, (0, common_1.Query)("skills")),
    __param(2, (0, common_1.Query)("clientId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Get project by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Project ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return the project",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Project not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Update project" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Project ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The project has been successfully updated.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Project not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({ summary: "Delete project" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Project ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The project has been successfully deleted.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Project not found." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)("projects"),
    (0, common_1.Controller)("projects"),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map