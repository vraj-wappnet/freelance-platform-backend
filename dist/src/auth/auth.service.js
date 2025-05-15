"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("./services/email.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async validateUser(email, password) {
        try {
            const user = await this.usersService.findByEmail(email);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const tokens = await this.generateTokens(user);
        await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
        return {
            user: {
                id: user.id,
                user_id: user.user_id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            ...tokens,
        };
    }
    async generateTokens(user) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
            }, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
            }),
            this.jwtService.signAsync({
                sub: user.id,
            }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(userId, refreshToken) {
        try {
            const user = await this.usersService.findById(userId);
            if (!user || !user.refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!refreshTokenMatches) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const tokens = await this.generateTokens(user);
            await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.usersService.setRefreshToken(userId, null);
        return true;
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async forgotPassword(forgotPasswordDto) {
        try {
            const { email } = forgotPasswordDto;
            const user = await this.usersService.findByEmail(email);
            const otp = this.generateOtp();
            await this.usersService.setPasswordResetOtp(email, otp);
            const emailSent = await this.emailService.sendPasswordResetEmail(user.email, user.firstName, otp);
            return emailSent;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return true;
            }
            throw error;
        }
    }
    async verifyOtp(verifyOtpDto) {
        const { email, otp } = verifyOtpDto;
        try {
            await this.usersService.validatePasswordResetOtp(email, otp);
            return true;
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
    }
    async resetPassword(resetPasswordDto) {
        const { email, otp, password } = resetPasswordDto;
        try {
            await this.usersService.validatePasswordResetOtp(email, otp);
            await this.usersService.resetPassword(email, password);
            await this.usersService.clearPasswordResetOtp(email);
            return true;
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map