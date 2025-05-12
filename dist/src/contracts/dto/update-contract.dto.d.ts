import { ContractStatus } from '../../common/enums/contract-status.enum';
export declare class UpdateContractDto {
    amount?: number;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: ContractStatus;
    clientAccepted?: boolean;
    freelancerAccepted?: boolean;
}
