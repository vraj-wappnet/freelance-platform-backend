import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from '../users/users.service';
export declare class ProjectsService {
    private projectsRepository;
    private usersService;
    constructor(projectsRepository: Repository<Project>, usersService: UsersService);
    create(userId: string, createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(status?: string, skills?: string[], clientId?: string): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    update(id: string, userId: string, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: string, userId: string): Promise<void>;
}
