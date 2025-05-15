import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { EmailService } from './services/email.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/entities/user.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private emailService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    validateUser(email: string, password: string): Promise<User>;
    login(loginDto: LoginDto): Promise<any>;
    generateTokens(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<any>;
    logout(userId: string): Promise<boolean>;
    private generateOtp;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<boolean>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<boolean>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean>;
}
