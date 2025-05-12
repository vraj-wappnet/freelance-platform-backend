import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Request } from "express";
interface UserRequest extends Request {
    user: {
        id: string;
    };
}
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: UserRequest, createProjectDto: CreateProjectDto): Promise<import("./entities/project.entity").Project>;
    findAll(status?: string, skillsString?: string, clientId?: string): Promise<import("./entities/project.entity").Project[]>;
    findOne(id: string): Promise<import("./entities/project.entity").Project>;
    update(id: string, req: UserRequest, updateProjectDto: UpdateProjectDto): Promise<import("./entities/project.entity").Project>;
    remove(id: string, req: UserRequest): Promise<void>;
}
export {};
