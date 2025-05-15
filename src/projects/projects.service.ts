import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { UsersService } from "../users/users.service";
import { Role } from "../common/enums/roles.enum";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private usersService: UsersService
  ) {}

  /**
   * Create a new project
   */
  async create(
    userId: string,
    createProjectDto: CreateProjectDto
  ): Promise<Project> {
    const user = await this.usersService.findById(userId);

    if (user.role !== Role.CLIENT) {
      throw new ForbiddenException("Only clients can create projects");
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      client: user,
    });

    return this.projectsRepository.save(project);
  }

  /**
   * Find all projects with optional filtering
   */
  async findAll(
    status?: string,
    skills?: string[],
    clientId?: string
  ): Promise<Project[]> {
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
      // For each skill, check if it's included in the project skills array
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

  /**
   * Find a project by id
   */
  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ["client", "bids", "bids.freelancer"],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  // projects.service.ts
  async findByUserId(userId: string): Promise<Project[]> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return this.projectsRepository.find({
      where: { client: { id: userId } },
      relations: ["client", "bids", "bids.freelancer"],
    });
  }

  /**
   * Update a project
   */
  async update(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    const project = await this.findOne(id);

    // Check if the user is the owner of the project or an admin
    const user = await this.usersService.findById(userId);

    if (project.client.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException("You can only update your own projects");
    }

    // Update project properties
    Object.assign(project, updateProjectDto);

    return this.projectsRepository.save(project);
  }

  /**
   * Delete a project
   */
  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id);

    // Check if the user is the owner of the project or an admin
    const user = await this.usersService.findById(userId);

    if (project.client.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException("You can only delete your own projects");
    }

    await this.projectsRepository.remove(project);
  }
}
