import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
export declare class Bid {
    id: string;
    amount: number;
    deliveryTime: number;
    proposal: string;
    isShortlisted: boolean;
    freelancer: User;
    freelancer_id: string;
    project: Project;
    project_id: string;
    createdAt: Date;
    updatedAt: Date;
}
