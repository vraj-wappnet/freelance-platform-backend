import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Milestone } from "./entities/milestone.entity";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { UpdateMilestoneDto } from "./dto/update-milestone.dto";
import { ContractStatus } from "../common/enums/contract-status.enum";
import { MilestoneStatus } from "../common/enums/milestone-status.enum";
import { Role } from "../common/enums/roles.enum";
import { UsersService } from "../users/users.service";

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestonesRepository: Repository<Milestone>,
    private usersService: UsersService
  ) {}

  /**
   * Create a new milestone
   */
  async create(
    userId: string,
    createMilestoneDto: CreateMilestoneDto
  ): Promise<Milestone> {
    const user = await this.usersService.findById(userId);

    // Find the contract with relations
    const contract = await this.milestonesRepository.manager
      .getRepository("Contract")
      .findOne({
        where: { id: createMilestoneDto.contract_id },
        relations: ["client", "freelancer"],
      });

    if (!contract) {
      throw new NotFoundException(
        `Contract with ID "${createMilestoneDto.contract_id}" not found`
      );
    }

    // Only client or admin can create milestones
    if (contract.client.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        "Only the client or an admin can create milestones"
      );
    }

    // Check contract status - can only add milestones to approved or in-progress contracts
    if (
      ![ContractStatus.APPROVED, ContractStatus.IN_PROGRESS].includes(
        contract.status
      )
    ) {
      throw new BadRequestException(
        "Can only add milestones to approved or in-progress contracts"
      );
    }

    // Create the milestone
    const milestone = this.milestonesRepository.create({
      ...createMilestoneDto,
      contract: { id: contract.id }, // assign only the id if Milestone expects a relation
      dueDate: createMilestoneDto.dueDate
        ? new Date(createMilestoneDto.dueDate)
        : undefined,
    });

    return this.milestonesRepository.save(milestone);
  }

  /**
   * Find all milestones with optional filtering
   */
  async findAll(
    contractId?: string,
    status?: MilestoneStatus
  ): Promise<Milestone[]> {
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

  /**
   * Find a milestone by id
   */
  async findOne(id: string): Promise<Milestone> {
    const milestone = await this.milestonesRepository.findOne({
      where: { id },
      relations: ["contract", "contract.client", "contract.freelancer"],
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID "${id}" not found`);
    }

    return milestone;
  }

  /**
   * Update a milestone
   */
  async update(
    id: string,
    userId: string,
    updateMilestoneDto: UpdateMilestoneDto
  ): Promise<Milestone> {
    const milestone = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    // Determine user role in this contract
    const isClient = milestone.contract.client.id === userId;
    const isFreelancer = milestone.contract.freelancer.id === userId;
    const isAdmin = user.role === Role.ADMIN;

    if (!isClient && !isFreelancer && !isAdmin) {
      throw new ForbiddenException("You cannot update this milestone");
    }

    // General fields that can be updated by both client and admin
    const updateFields: any = {};

    if (isClient || isAdmin) {
      // Client and admin can update basic milestone details
      if (updateMilestoneDto.title)
        updateFields.title = updateMilestoneDto.title;
      if (updateMilestoneDto.description)
        updateFields.description = updateMilestoneDto.description;
      if (updateMilestoneDto.amount)
        updateFields.amount = updateMilestoneDto.amount;
      if (updateMilestoneDto.dueDate)
        updateFields.dueDate = new Date(updateMilestoneDto.dueDate);
    }

    // Handle status updates based on user role
    if (updateMilestoneDto.status) {
      const currentStatus = milestone.status;
      const newStatus = updateMilestoneDto.status;

      // Client-specific status changes
      if (isClient) {
        // Client can approve a milestone in REVIEW status
        if (
          currentStatus === MilestoneStatus.REVIEW &&
          newStatus === MilestoneStatus.APPROVED
        ) {
          updateFields.status = MilestoneStatus.APPROVED;
        }
        // Client can mark a milestone as PAID
        else if (
          currentStatus === MilestoneStatus.APPROVED &&
          newStatus === MilestoneStatus.PAID
        ) {
          updateFields.status = MilestoneStatus.PAID;
          updateFields.paymentDate = new Date();
        } else {
          throw new ForbiddenException(
            `Client cannot change milestone status from ${currentStatus} to ${newStatus}`
          );
        }
      }

      // Freelancer-specific status changes
      if (isFreelancer) {
        // Freelancer can start working on a PENDING milestone
        if (
          currentStatus === MilestoneStatus.PENDING &&
          newStatus === MilestoneStatus.IN_PROGRESS
        ) {
          updateFields.status = MilestoneStatus.IN_PROGRESS;
        }
        // Freelancer can submit work for review
        else if (
          currentStatus === MilestoneStatus.IN_PROGRESS &&
          newStatus === MilestoneStatus.REVIEW
        ) {
          if (!updateMilestoneDto.completionNote) {
            throw new BadRequestException(
              "Completion note is required when submitting for review"
            );
          }
          updateFields.status = MilestoneStatus.REVIEW;
          updateFields.completionNote = updateMilestoneDto.completionNote;
        } else {
          throw new ForbiddenException(
            `Freelancer cannot change milestone status from ${currentStatus} to ${newStatus}`
          );
        }
      }

      // Admin can update any status
      if (isAdmin) {
        updateFields.status = newStatus;
        if (newStatus === MilestoneStatus.PAID) {
          updateFields.paymentDate = updateMilestoneDto.paymentDate
            ? new Date(updateMilestoneDto.paymentDate)
            : new Date();
        }
        if (updateMilestoneDto.completionNote) {
          updateFields.completionNote = updateMilestoneDto.completionNote;
        }
      }
    } else {
      // If no status change, freelancer can update completionNote for IN_PROGRESS or REVIEW status
      if (
        isFreelancer &&
        [MilestoneStatus.IN_PROGRESS, MilestoneStatus.REVIEW].includes(
          milestone.status
        ) &&
        updateMilestoneDto.completionNote
      ) {
        updateFields.completionNote = updateMilestoneDto.completionNote;
      }
    }

    // Check if there are valid updates to apply
    if (Object.keys(updateFields).length === 0) {
      throw new BadRequestException("No valid fields to update");
    }

    // Apply updates
    Object.assign(milestone, updateFields);

    return this.milestonesRepository.save(milestone);
  }

  /**
   * Delete a milestone
   */
  async remove(id: string, userId: string): Promise<void> {
    const milestone = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    // Only client or admin can delete a milestone
    if (milestone.contract.client.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        "Only the client or an admin can delete a milestone"
      );
    }

    // Can only delete PENDING milestones
    if (milestone.status !== MilestoneStatus.PENDING) {
      throw new ForbiddenException("Can only delete pending milestones");
    }

    await this.milestonesRepository.remove(milestone);
  }
}
