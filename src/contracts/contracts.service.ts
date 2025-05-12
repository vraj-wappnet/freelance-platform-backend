import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { ContractStatus } from '../common/enums/contract-status.enum';
import { ProjectStatus } from '../common/enums/project-status.enum';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    private usersService: UsersService,
    private projectsService: ProjectsService,
  ) {}

  /**
   * Create a new contract
   */
  async create(userId: string, createContractDto: CreateContractDto): Promise<Contract> {
    const client = await this.usersService.findById(userId);
    
    if (client.role !== Role.CLIENT) {
      throw new ForbiddenException('Only clients can create contracts');
    }

    const project = await this.projectsService.findOne(createContractDto.project_id);
    
    // Check if the user is the owner of the project
    if (project.client.id !== userId) {
      throw new ForbiddenException('You can only create contracts for your own projects');
    }

    // Check if the project already has an active contract
    const existingContracts = await this.contractsRepository.find({
      where: {
        project_id: project.id,
        status: ContractStatus.IN_PROGRESS,
      },
    });

    if (existingContracts.length > 0) {
      throw new ConflictException('This project already has an active contract');
    }

    const freelancer = await this.usersService.findById(createContractDto.freelancer_id);
    
    if (freelancer.role !== Role.FREELANCER) {
      throw new ForbiddenException('The selected user is not a freelancer');
    }

    // Create the contract
    const contract = this.contractsRepository.create({
      ...createContractDto,
      client,
      freelancer,
      project,
      clientAccepted: true, // Client automatically accepts when creating
    });

    // Update project status to IN_PROGRESS when both parties accept
    if (project.status === ProjectStatus.OPEN) {
      project.status = ProjectStatus.IN_PROGRESS;
      await this.projectsService.update(project.id, userId, { status: ProjectStatus.IN_PROGRESS });
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
    status?: ContractStatus,
  ): Promise<Contract[]> {
    const queryBuilder = this.contractsRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.client', 'client')
      .leftJoinAndSelect('contract.freelancer', 'freelancer')
      .leftJoinAndSelect('contract.project', 'project')
      .select([
        'contract',
        'client.id',
        'client.user_id',
        'client.firstName',
        'client.lastName',
        'freelancer.id',
        'freelancer.user_id',
        'freelancer.firstName',
        'freelancer.lastName',
        'project.id',
        'project.title',
      ]);

    if (clientId) {
      queryBuilder.andWhere('contract.client_id = :clientId', { clientId });
    }

    if (freelancerId) {
      queryBuilder.andWhere('contract.freelancer_id = :freelancerId', { freelancerId });
    }

    if (projectId) {
      queryBuilder.andWhere('contract.project_id = :projectId', { projectId });
    }

    if (status) {
      queryBuilder.andWhere('contract.status = :status', { status });
    }

    return queryBuilder.getMany();
  }

  /**
   * Find a contract by id
   */
  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: ['client', 'freelancer', 'project', 'milestones'],
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID "${id}" not found`);
    }

    return contract;
  }

  /**
   * Update a contract
   */
  async update(
    id: string,
    userId: string,
    updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    const contract = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    // Determine if user can update this contract
    const isClient = contract.client.id === userId;
    const isFreelancer = contract.freelancer.id === userId;
    const isAdmin = user.role === Role.ADMIN;

    if (!isClient && !isFreelancer && !isAdmin) {
      throw new ForbiddenException('You cannot update this contract');
    }

    // Handle specific update cases
    if (isClient) {
      // Client can update clientAccepted and some contract details
      if (updateContractDto.clientAccepted !== undefined) {
        contract.clientAccepted = updateContractDto.clientAccepted;
      }
      
      // Client can update these fields
      if (updateContractDto.amount) contract.amount = updateContractDto.amount;
      if (updateContractDto.description) contract.description = updateContractDto.description;
      if (updateContractDto.startDate) contract.startDate = new Date(updateContractDto.startDate);
      if (updateContractDto.endDate) contract.endDate = new Date(updateContractDto.endDate);
    }

    if (isFreelancer) {
      // Freelancer can only update freelancerAccepted
      if (updateContractDto.freelancerAccepted !== undefined) {
        contract.freelancerAccepted = updateContractDto.freelancerAccepted;
      }
    }

    if (isAdmin) {
      // Admin can update all fields
      Object.assign(contract, {
        ...updateContractDto,
        startDate: updateContractDto.startDate ? new Date(updateContractDto.startDate) : contract.startDate,
        endDate: updateContractDto.endDate ? new Date(updateContractDto.endDate) : contract.endDate,
      });
    }

    // Check if both parties have accepted
    if (contract.clientAccepted && contract.freelancerAccepted) {
      contract.status = ContractStatus.APPROVED;
      
      // Update project status to IN_PROGRESS
      await this.projectsService.update(
        contract.project.id,
        userId,
        { status: ProjectStatus.IN_PROGRESS },
      );
    }

    // Handle explicit status changes if provided (admin only)
    if (isAdmin && updateContractDto.status) {
      contract.status = updateContractDto.status;
      
      // Sync project status with contract status
      if (updateContractDto.status === ContractStatus.COMPLETED) {
        await this.projectsService.update(
          contract.project.id,
          userId,
          { status: ProjectStatus.COMPLETED },
        );
      } else if (updateContractDto.status === ContractStatus.CANCELLED) {
        await this.projectsService.update(
          contract.project.id,
          userId,
          { status: ProjectStatus.CANCELLED },
        );
      }
    }

    return this.contractsRepository.save(contract);
  }

  /**
   * Delete a contract
   */
  async remove(id: string, userId: string): Promise<void> {
    const contract = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    // Only client or admin can delete a contract
    if (contract.client.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only the client or an admin can delete a contract');
    }

    // Can only delete contracts in PROPOSAL status
    if (contract.status !== ContractStatus.PROPOSAL) {
      throw new ForbiddenException('Can only delete contracts in proposal status');
    }

    await this.contractsRepository.remove(contract);
  }
}