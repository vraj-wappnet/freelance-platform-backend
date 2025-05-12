import { BidsService } from "./bids.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import { UpdateBidDto } from "./dto/update-bid.dto";
import { Request } from "express";
interface UserRequest extends Request {
    user: {
        id: string;
    };
}
export declare class BidsController {
    private readonly bidsService;
    constructor(bidsService: BidsService);
    create(req: UserRequest, createBidDto: CreateBidDto): Promise<import("./entities/bid.entity").Bid>;
    findAll(projectId?: string, freelancerId?: string): Promise<import("./entities/bid.entity").Bid[]>;
    findOne(id: string): Promise<import("./entities/bid.entity").Bid>;
    update(id: string, req: UserRequest, updateBidDto: UpdateBidDto): Promise<import("./entities/bid.entity").Bid>;
    remove(id: string, req: UserRequest): Promise<void>;
}
export {};
