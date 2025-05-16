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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const update_profile_dto_1 = require("./dto/update-profile.dto");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger(AuthController_1.name);
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
    getProfile(req) {
        return this.authService.getProfile(req.user.id);
    }
    async updateProfile(req, updateProfileDto) {
        this.logger.debug("Received updateProfile request", {
            userId: req.user.id,
            updateProfileDto,
        });
        if (Object.keys(updateProfileDto).length === 0) {
            this.logger.warn("Empty updateProfileDto received", {
                userId: req.user.id,
            });
            throw new common_1.BadRequestException("No fields provided for update");
        }
        const updatedProfile = await this.authService.updateProfile(req.user.id, updateProfileDto);
        this.logger.debug("Profile updated successfully", {
            userId: req.user.id,
            updatedProfile,
        });
        return updatedProfile;
    }
    async uploadProfilePhoto(req, file) {
        this.logger.debug("Received profile photo upload request", {
            userId: req.user.id,
            file: file
                ? {
                    originalname: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                }
                : null,
            headers: req.headers,
        });
        if (!file) {
            this.logger.warn("No file received in profile photo upload", {
                userId: req.user.id,
            });
            throw new common_1.BadRequestException("Profile photo is required");
        }
        if (!file.mimetype.match(/(jpg|jpeg|png)$/i)) {
            this.logger.warn("Invalid file type", {
                userId: req.user.id,
                mimetype: file.mimetype,
            });
            throw new common_1.BadRequestException("Only JPEG or PNG files are allowed");
        }
        if (file.size > 5 * 1024 * 1024) {
            this.logger.warn("File too large", {
                userId: req.user.id,
                size: file.size,
            });
            throw new common_1.BadRequestException("File size must be less than 5MB");
        }
        const updatedProfile = await this.authService.uploadProfilePhoto(req.user.id, file);
        this.logger.debug("Profile photo uploaded successfully", {
            userId: req.user.id,
            updatedProfile,
        });
        return updatedProfile;
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
                        profilePhoto: { type: "string" },
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
__decorate([
    (0, common_1.Get)("profile"),
    (0, swagger_1.ApiOperation)({ summary: "Get user profile" }),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User profile retrieved successfully",
        schema: {
            properties: {
                id: { type: "string" },
                user_id: { type: "string" },
                email: { type: "string" },
                firstName: { type: "string" },
                lastName: { type: "string" },
                role: { type: "string" },
                profilePhoto: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)("profile"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, swagger_1.ApiOperation)({ summary: "Update user profile" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        description: "Update user profile with optional fields",
        schema: {
            type: "object",
            properties: {
                firstName: { type: "string", nullable: true },
                lastName: { type: "string", nullable: true },
                location: { type: "string", nullable: true },
                phone: { type: "string", nullable: true },
                bio: { type: "string", nullable: true },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User profile updated successfully",
        schema: {
            properties: {
                id: { type: "string" },
                user_id: { type: "string" },
                email: { type: "string" },
                firstName: { type: "string" },
                lastName: { type: "string" },
                location: { type: "string" },
                phone: { type: "string" },
                bio: { type: "string" },
                role: { type: "string" },
                profilePhoto: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "No fields provided for update" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)("profile-photo"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("profilePhoto")),
    (0, swagger_1.ApiOperation)({ summary: "Upload user profile photo" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        description: "Upload profile photo",
        schema: {
            type: "object",
            properties: {
                profilePhoto: { type: "string", format: "binary" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile photo uploaded successfully",
        schema: {
            properties: {
                id: { type: "string" },
                user_id: { type: "string" },
                email: { type: "string" },
                firstName: { type: "string" },
                lastName: { type: "string" },
                location: { type: "string" },
                phone: { type: "string" },
                bio: { type: "string" },
                role: { type: "string" },
                profilePhoto: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Invalid file type, size, or missing file",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "uploadProfilePhoto", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map