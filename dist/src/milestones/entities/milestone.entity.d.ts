import { Contract } from '../../contracts/entities/contract.entity';
import { MilestoneStatus } from '../../common/enums/milestone-status.enum';
export declare class Milestone {
    id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
    status: MilestoneStatus;
    completionNote: string;
    paymentDate: Date;
    contract: Contract;
    contract_id: string;
    createdAt: Date;
    updatedAt: Date;
}
