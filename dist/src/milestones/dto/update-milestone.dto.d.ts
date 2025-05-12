import { MilestoneStatus } from '../../common/enums/milestone-status.enum';
export declare class UpdateMilestoneDto {
    title?: string;
    description?: string;
    amount?: number;
    dueDate?: string;
    status?: MilestoneStatus;
    completionNote?: string;
    paymentDate?: string;
}
