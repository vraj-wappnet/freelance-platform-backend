import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Contract } from "./entities/contract.entity";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { UsersService } from "../users/users.service";
import { ProjectsService } from "../projects/projects.service";
import { ContractStatus } from "../common/enums/contract-status.enum";
import { ProjectStatus } from "../common/enums/project-status.enum";
import { Role } from "../common/enums/roles.enum";
import { validate as isUUID } from "uuid";

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    private usersService: UsersService,
    private projectsService: ProjectsService
  ) {}

  /**
   * Create a new contract
   */
  async create(
    userId: string,
    createContractDto: CreateContractDto
  ): Promise<Contract> {
    if (!isUUID(userId)) {
      throw new BadRequestException("Invalid user ID: must be a valid UUID");
    }
    if (!isUUID(createContractDto.freelancer_id)) {
      throw new BadRequestException(
        "Invalid freelancer ID: must be a valid UUID"
      );
    }
    if (!isUUID(createContractDto.project_id)) {
      throw new BadRequestException("Invalid project ID: must be a valid UUID");
    }

    const client = await this.usersService.findById(userId);

    if (client.role !== Role.CLIENT) {
      throw new ForbiddenException("Only clients can create contracts");
    }

    const project = await this.projectsService.findOne(
      createContractDto.project_id
    );

    if (project.client.id !== userId) {
      throw new ForbiddenException(
        "You can only create contracts for your own projects"
      );
    }

    const existingContracts = await this.contractsRepository.find({
      where: {
        project_id: project.id,
        status: ContractStatus.IN_PROGRESS,
      },
    });

    if (existingContracts.length > 0) {
      throw new ConflictException(
        "This project already has an active contract"
      );
    }

    const freelancer = await this.usersService.findById(
      createContractDto.freelancer_id
    );

    if (freelancer.role !== Role.FREELANCER) {
      throw new ForbiddenException("The selected user is not a freelancer");
    }

    const contract = this.contractsRepository.create({
      ...createContractDto,
      client,
      freelancer,
      project,
      clientAccepted: true,
    });

    if (project.status === ProjectStatus.OPEN) {
      project.status = ProjectStatus.IN_PROGRESS;
      await this.projectsService.update(project.id, userId, {
        status: ProjectStatus.IN_PROGRESS,
      });
    }

    return this.contractsRepository.save(contract);
  }

  /**
   * Find all contracts with optional filtering
   */
  async findAll(
    clientId?: string,
    freelancerId?: string,
    projectId?: string,
    status?: ContractStatus
  ): Promise<Contract[]> {
    if (clientId && !isUUID(clientId)) {
      throw new BadRequestException("Invalid client ID: must be a valid UUID");
    }
    if (freelancerId && !isUUID(freelancerId)) {
      throw new BadRequestException(
        "Invalid freelancer ID: must be a valid UUID"
      );
    }
    if (projectId && !isUUID(projectId)) {
      throw new BadRequestException("Invalid project ID: must be a valid UUID");
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

  /**
   * Find a contract by id
   */
  async findOne(id: string): Promise<Contract> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        "Invalid contract ID: must be a valid UUID"
      );
    }

    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: ["client", "freelancer", "project", "milestones"],
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID "${id}" not found`);
    }

    return contract;
  }

  /**
   * Find contracts by user (client or freelancer)
   */
  async findByUser(userId: string): Promise<Contract[]> {
    if (!isUUID(userId)) {
      throw new BadRequestException("Invalid user ID: must be a valid UUID");
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

  /**
   * Update a contract
   */
  async update(
    id: string,
    userId: string,
    updateContractDto: UpdateContractDto
  ): Promise<Contract> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        "Invalid contract ID: must be a valid UUID"
      );
    }
    if (!isUUID(userId)) {
      throw new BadRequestException("Invalid user ID: must be a valid UUID");
    }

    const contract = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    const isClient = contract.client.id === userId;
    const isFreelancer = contract.freelancer.id === userId;
    const isAdmin = user.role === Role.ADMIN;

    if (!isClient && !isFreelancer && !isAdmin) {
      throw new ForbiddenException("You cannot update this contract");
    }

    if (isClient) {
      if (updateContractDto.clientAccepted !== undefined) {
        contract.clientAccepted = updateContractDto.clientAccepted;
      }
      if (updateContractDto.amount) contract.amount = updateContractDto.amount;
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
      // Prevent freelancers from updating other fields
      if (
        updateContractDto.amount ||
        updateContractDto.description ||
        updateContractDto.startDate ||
        updateContractDto.endDate
      ) {
        throw new ForbiddenException(
          "Freelancers can only update freelancerAccepted"
        );
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
      contract.status = ContractStatus.APPROVED;
      // Use client ID (project owner) to update project status
      await this.projectsService.update(
        contract.project.id,
        contract.client.id,
        {
          status: ProjectStatus.IN_PROGRESS,
        }
      );
    }

    if (isAdmin && updateContractDto.status) {
      contract.status = updateContractDto.status;
      if (updateContractDto.status === ContractStatus.COMPLETED) {
        await this.projectsService.update(
          contract.project.id,
          contract.client.id,
          {
            status: ProjectStatus.COMPLETED,
          }
        );
      } else if (updateContractDto.status === ContractStatus.CANCELLED) {
        await this.projectsService.update(
          contract.project.id,
          contract.client.id,
          {
            status: ProjectStatus.CANCELLED,
          }
        );
      }
    }

    return this.contractsRepository.save(contract);
  }

  /**
   * Delete a contract
   */
  async remove(id: string, userId: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        "Invalid contract ID: must be a valid UUID"
      );
    }
    if (!isUUID(userId)) {
      throw new BadRequestException("Invalid user ID: must be a valid UUID");
    }

    const contract = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    if (contract.client.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        "Only the client or an admin can delete a contract"
      );
    }

    if (contract.status !== ContractStatus.PROPOSAL) {
      throw new ForbiddenException(
        "Can only delete contracts in proposal status"
      );
    }

    await this.contractsRepository.remove(contract);
  }
}
