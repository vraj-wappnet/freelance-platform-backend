import { MilestonesService } from "./milestones.service";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { UpdateMilestoneDto } from "./dto/update-milestone.dto";
import { MilestoneStatus } from "../common/enums/milestone-status.enum";
import { UserRequest } from "src/common/interfaces/user-request.interface";
export declare class MilestonesController {
    private readonly milestonesService;
    constructor(milestonesService: MilestonesService);
    create(req: UserRequest, createMilestoneDto: CreateMilestoneDto): Promise<import("./entities/milestone.entity").Milestone>;
    findAll(contractId?: string, status?: MilestoneStatus): Promise<import("./entities/milestone.entity").Milestone[]>;
    findOne(id: string): Promise<import("./entities/milestone.entity").Milestone>;
    update(id: string, req: UserRequest, updateMilestoneDto: UpdateMilestoneDto): Promise<import("./entities/milestone.entity").Milestone>;
    remove(id: string, req: UserRequest): Promise<void>;
}
