import { ContractsService } from "./contracts.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { ContractStatus } from "../common/enums/contract-status.enum";
import { UserRequest } from "src/common/interfaces/user-request.interface";
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(req: UserRequest, createContractDto: CreateContractDto): Promise<import("./entities/contract.entity").Contract>;
    findAll(clientId?: string, freelancerId?: string, projectId?: string, status?: ContractStatus): Promise<import("./entities/contract.entity").Contract[]>;
    findOne(id: string): Promise<import("./entities/contract.entity").Contract>;
    update(id: string, req: UserRequest, updateContractDto: UpdateContractDto): Promise<import("./entities/contract.entity").Contract>;
    remove(id: string, req: UserRequest): Promise<void>;
}
