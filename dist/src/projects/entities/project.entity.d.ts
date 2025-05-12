import { User } from '../../users/entities/user.entity';
import { Bid } from '../../bids/entities/bid.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { ProjectStatus } from '../../common/enums/project-status.enum';
export declare class Project {
    id: string;
    title: string;
    description: string;
    budget: number;
    deadline: Date;
    status: ProjectStatus;
    skills: string[];
    attachments: string;
    client: User;
    client_id: string;
    bids: Bid[];
    contracts: Contract[];
    createdAt: Date;
    updatedAt: Date;
}
