import { ProjectStatus } from '../../common/enums/project-status.enum';
export declare class UpdateProjectDto {
    title?: string;
    description?: string;
    budget?: number;
    deadline?: string;
    status?: ProjectStatus;
    skills?: string[];
    attachments?: string;
}
