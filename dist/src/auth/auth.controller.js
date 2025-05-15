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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(loginDto) {
        return this.authService.login(loginDto);
    }
    refresh(req, refreshTokenDto) {
        const userId = req.user.id;
        const refreshToken = refreshTokenDto.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }
    forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    verifyOtp(verifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto);
    }
    resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("login"),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "User login" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User logged in successfully",
        schema: {
            properties: {
                user: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        user_id: { type: "string" },
                        email: { type: "string" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        role: { type: "string" },
                    },
                },
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("refresh"),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt-refresh")),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Refresh access token" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Tokens refreshed successfully",
        schema: {
            properties: {
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid refresh token" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Request password reset OTP" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Password reset OTP email sent if the email exists",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("verify-otp"),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Verify OTP for password reset" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "OTP verified successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid or expired OTP" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Reset password using OTP" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password reset successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid or expired OTP" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map