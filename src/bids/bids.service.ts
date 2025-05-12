import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { Role } from '../common/enums/roles.enum';
import { ProjectStatus } from '../common/enums/project-status.enum';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
    private usersService: UsersService,
    private projectsService: ProjectsService,
  ) {}

  /**
   * Create a new bid
   */
  async create(userId: string, createBidDto: CreateBidDto): Promise<Bid> {
    const user = await this.usersService.findById(userId);
    
    if (user.role !== Role.FREELANCER) {
      throw new ForbiddenException('Only freelancers can create bids');
    }

    const project = await this.projectsService.findOne(createBidDto.project_id);
    
    if (project.status !== ProjectStatus.OPEN) {
      throw new ForbiddenException('Can only bid on open projects');
    }

    // Check if the user already placed a bid for this project
    const existingBid = await this.bidsRepository.findOne({
      where: {
        freelancer_id: userId,
        project_id: createBidDto.project_id,
      },
    });

    if (existingBid) {
      throw new ConflictException('You have already placed a bid for this project');
    }

    const bid = this.bidsRepository.create({
      ...createBidDto,
      freelancer: user,
      project,
    });

    return this.bidsRepository.save(bid);
  }

  /**
   * Find all bids with optional filtering
   */
  async findAll(
    projectId?: string,
    freelancerId?: string,
  ): Promise<Bid[]> {
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

  /**
   * Find a bid by id
   */
  async findOne(id: string): Promise<Bid> {
    const bid = await this.bidsRepository.findOne({
      where: { id },
      relations: ['freelancer', 'project', 'project.client'],
    });

    if (!bid) {
      throw new NotFoundException(`Bid with ID "${id}" not found`);
    }

    return bid;
  }

  /**
   * Update a bid
   */
  async update(
    id: string,
    userId: string,
    updateBidDto: UpdateBidDto,
  ): Promise<Bid> {
    const bid = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    // Only the bid owner can update amount, deliveryTime, proposal
    if (bid.freelancer.id === userId && user.role === Role.FREELANCER) {
      if (updateBidDto.amount) bid.amount = updateBidDto.amount;
      if (updateBidDto.deliveryTime) bid.deliveryTime = updateBidDto.deliveryTime;
      if (updateBidDto.proposal) bid.proposal = updateBidDto.proposal;
    } 
    // Only the project owner can update isShortlisted
    else if (bid.project.client.id === userId && user.role === Role.CLIENT) {
      if (updateBidDto.isShortlisted !== undefined) {
        bid.isShortlisted = updateBidDto.isShortlisted;
      }
    } 
    // Admin can update everything
    else if (user.role === Role.ADMIN) {
      Object.assign(bid, updateBidDto);
    } 
    else {
      throw new ForbiddenException('You do not have permission to update this bid');
    }

    return this.bidsRepository.save(bid);
  }

  /**
   * Delete a bid
   */
  async remove(id: string, userId: string): Promise<void> {
    const bid = await this.findOne(id);
    const user = await this.usersService.findById(userId);

    // Check if the user is the owner of the bid or an admin
    if (bid.freelancer.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own bids');
    }

    await this.bidsRepository.remove(bid);
  }
}