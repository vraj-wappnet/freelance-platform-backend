import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Milestone } from '../../milestones/entities/milestone.entity';
import { ContractStatus } from '../../common/enums/contract-status.enum';
export declare class Contract {
    id: string;
    amount: number;
    description: string;
    startDate: Date;
    endDate: Date;
    status: ContractStatus;
    clientAccepted: boolean;
    freelancerAccepted: boolean;
    client: User;
    client_id: string;
    freelancer: User;
    freelancer_id: string;
    project: Project;
    project_id: string;
    milestones: Milestone[];
    createdAt: Date;
    updatedAt: Date;
}
