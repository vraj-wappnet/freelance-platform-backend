import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { Public } from "../common/decorators/public.decorator";
import { UserRequest } from "../common/interfaces/user-request.interface";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
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
}
