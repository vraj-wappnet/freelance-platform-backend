import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { UserRequest } from "../common/interfaces/user-request.interface";
import { BufferedFile } from "../common/interfaces/file.interface";
import { UpdateProfileDto } from "./dto/update-profile.dto";
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<any>;
    refresh(req: UserRequest, refreshTokenDto: RefreshTokenDto): Promise<any>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<boolean>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<boolean>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean>;
    getProfile(req: UserRequest): Promise<import("../users/entities/user.entity").User>;
    updateProfile(req: UserRequest, updateProfileDto: UpdateProfileDto): Promise<import("../users/entities/user.entity").User>;
    uploadProfilePhoto(req: UserRequest, file: BufferedFile): Promise<import("../users/entities/user.entity").User>;
}
