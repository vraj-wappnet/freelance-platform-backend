import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findByRole(role: string): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByUserId(userId: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    setPasswordResetOtp(email: string, otp: string): Promise<void>;
    validatePasswordResetOtp(email: string, otp: string): Promise<void>;
    clearPasswordResetOtp(email: string): Promise<void>;
    resetPassword(email: string, password: string): Promise<User>;
    setRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    remove(id: string): Promise<void>;
    updateProfile(userId: string, updateData: {
        firstName?: string;
        lastName?: string;
        location?: string;
        phone?: string;
        bio?: string;
        profilePhoto?: string;
    }): Promise<User>;
}
