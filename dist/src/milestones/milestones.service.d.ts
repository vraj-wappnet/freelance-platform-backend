import { Repository } from "typeorm";
import { Milestone } from "./entities/milestone.entity";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { UpdateMilestoneDto } from "./dto/update-milestone.dto";
import { MilestoneStatus } from "../common/enums/milestone-status.enum";
import { UsersService } from "../users/users.service";
export declare class MilestonesService {
    private milestonesRepository;
    private usersService;
    constructor(milestonesRepository: Repository<Milestone>, usersService: UsersService);
    create(userId: string, createMilestoneDto: CreateMilestoneDto): Promise<Milestone>;
    findAll(contractId?: string, status?: MilestoneStatus): Promise<Milestone[]>;
    findOne(id: string): Promise<Milestone>;
    update(id: string, userId: string, updateMilestoneDto: UpdateMilestoneDto): Promise<Milestone>;
    remove(id: string, userId: string): Promise<void>;
}
