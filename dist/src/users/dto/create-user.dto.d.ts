import { Role } from '../../common/enums/roles.enum';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
    bio?: string;
    location?: string;
    phone?: string;
}
