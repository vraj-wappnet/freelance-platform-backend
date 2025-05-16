import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
  Get,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { Public } from "../common/decorators/public.decorator";
import { UserRequest } from "../common/interfaces/user-request.interface";
import { BufferedFile } from "../common/interfaces/file.interface";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("refresh")
  @Public()
  @UseGuards(AuthGuard("jwt-refresh"))
  @HttpCode(200)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Tokens refreshed successfully",
    schema: {
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Invalid refresh token" })
  refresh(@Req() req: UserRequest, @Body() refreshTokenDto: RefreshTokenDto) {
    const userId = req.user.id;
    const refreshToken = refreshTokenDto.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post("forgot-password")
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: "Request password reset OTP" })
  @ApiResponse({
    status: 200,
    description: "Password reset OTP email sent if the email exists",
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post("verify-otp")
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: "Verify OTP for password reset" })
  @ApiResponse({ status: 200, description: "OTP verified successfully" })
  @ApiResponse({ status: 400, description: "Invalid or expired OTP" })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post("reset-password")
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: "Reset password using OTP" })
  @ApiResponse({ status: 200, description: "Password reset successfully" })
  @ApiResponse({ status: 400, description: "Invalid or expired OTP" })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get("profile")
  @ApiOperation({ summary: "Get user profile" })
  @ApiBearerAuth("access-token")
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getProfile(@Req() req: UserRequest) {
    return this.authService.getProfile(req.user.id);
  }

  @Patch("profile")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Update user profile" })
  @ApiBearerAuth()
  @ApiBody({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 400, description: "No fields provided for update" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateProfile(
    @Req() req: UserRequest,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    this.logger.debug("Received updateProfile request", {
      userId: req.user.id,
      updateProfileDto,
    });

    // Reject if no fields provided
    if (Object.keys(updateProfileDto).length === 0) {
      this.logger.warn("Empty updateProfileDto received", {
        userId: req.user.id,
      });
      throw new BadRequestException("No fields provided for update");
    }

    const updatedProfile = await this.authService.updateProfile(
      req.user.id,
      updateProfileDto
    );
    this.logger.debug("Profile updated successfully", {
      userId: req.user.id,
      updatedProfile,
    });

    return updatedProfile;
  }

  @Post("profile-photo")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("profilePhoto"))
  @ApiOperation({ summary: "Upload user profile photo" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Upload profile photo",
    schema: {
      type: "object",
      properties: {
        profilePhoto: { type: "string", format: "binary" },
      },
    },
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: "Invalid file type, size, or missing file",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async uploadProfilePhoto(
    @Req() req: UserRequest,
    @UploadedFile() file: BufferedFile
  ) {
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
      throw new BadRequestException("Profile photo is required");
    }

    // Validate file type and size
    if (!file.mimetype.match(/(jpg|jpeg|png)$/i)) {
      this.logger.warn("Invalid file type", {
        userId: req.user.id,
        mimetype: file.mimetype,
      });
      throw new BadRequestException("Only JPEG or PNG files are allowed");
    }
    if (file.size > 5 * 1024 * 1024) {
      this.logger.warn("File too large", {
        userId: req.user.id,
        size: file.size,
      });
      throw new BadRequestException("File size must be less than 5MB");
    }

    const updatedProfile = await this.authService.uploadProfilePhoto(
      req.user.id,
      file
    );
    this.logger.debug("Profile photo uploaded successfully", {
      userId: req.user.id,
      updatedProfile,
    });

    return updatedProfile;
  }
}
