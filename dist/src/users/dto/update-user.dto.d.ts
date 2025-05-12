import { Role } from '../../common/enums/roles.enum';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;
    bio?: string;
    location?: string;
    phone?: string;
    website?: string;
    profilePicture?: string;
}
