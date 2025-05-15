import { Repository } from "typeorm";
import { Contract } from "./entities/contract.entity";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { UsersService } from "../users/users.service";
import { ProjectsService } from "../projects/projects.service";
import { ContractStatus } from "../common/enums/contract-status.enum";
export declare class ContractsService {
    private contractsRepository;
    private usersService;
    private projectsService;
    constructor(contractsRepository: Repository<Contract>, usersService: UsersService, projectsService: ProjectsService);
    create(userId: string, createContractDto: CreateContractDto): Promise<Contract>;
    findAll(clientId?: string, freelancerId?: string, projectId?: string, status?: ContractStatus): Promise<Contract[]>;
    findOne(id: string): Promise<Contract>;
    findByUser(userId: string): Promise<Contract[]>;
    update(id: string, userId: string, updateContractDto: UpdateContractDto): Promise<Contract>;
    remove(id: string, userId: string): Promise<void>;
}
