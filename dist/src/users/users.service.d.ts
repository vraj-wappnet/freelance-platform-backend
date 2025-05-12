import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByUserId(userId: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    setPasswordResetToken(email: string): Promise<{
        token: string;
        user: User;
    }>;
    validatePasswordResetToken(email: string, token: string): Promise<User>;
    resetPassword(email: string, password: string): Promise<User>;
    setRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    remove(id: string): Promise<void>;
}
