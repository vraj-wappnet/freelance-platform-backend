import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
export declare class BidsService {
    private bidsRepository;
    private usersService;
    private projectsService;
    constructor(bidsRepository: Repository<Bid>, usersService: UsersService, projectsService: ProjectsService);
    create(userId: string, createBidDto: CreateBidDto): Promise<Bid>;
    findByUserId(userId: string): Promise<Bid[]>;
    findAll(projectId?: string, freelancerId?: string): Promise<Bid[]>;
    findOne(id: string): Promise<Bid>;
    update(id: string, userId: string, updateBidDto: UpdateBidDto): Promise<Bid>;
    remove(id: string, userId: string): Promise<void>;
}
