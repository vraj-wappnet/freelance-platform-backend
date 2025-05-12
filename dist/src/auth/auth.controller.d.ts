import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRequest } from '../common/interfaces/user-request.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<any>;
    refresh(req: UserRequest, refreshTokenDto: RefreshTokenDto): Promise<any>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<boolean>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean>;
}
