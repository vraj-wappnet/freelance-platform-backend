import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UsersService } from "../../users/users.service";
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private configService;
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(req: Request, payload: any): Promise<{
        id: string;
        user_id: string;
        email: string;
        role: import("../../common/enums/roles.enum").Role;
        refreshToken: string;
    }>;
}
export {};
