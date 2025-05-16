import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { EmailService } from "./services/email.service";
import { CloudinaryService } from "./services/cloudinary.service";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { User } from "../users/entities/user.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { BufferedFile } from "src/common/interfaces/file.interface";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
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
        profilePhoto: user.profilePhoto,
      },
      ...tokens,
    };
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
          expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRATION"),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRATION"),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<any> {
    try {
      const user = await this.usersService.findById(userId);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.generateTokens(user);

      await this.usersService.setRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string): Promise<boolean> {
    await this.usersService.setRefreshToken(userId, null);
    return true;
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<boolean> {
    try {
      const { email } = forgotPasswordDto;

      const user = await this.usersService.findByEmail(email);
      const otp = this.generateOtp();

      await this.usersService.setPasswordResetOtp(email, otp);

      const emailSent = await this.emailService.sendPasswordResetEmail(
        user.email,
        user.firstName,
        otp,
      );

      return emailSent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return true;
      }
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const { email, otp } = verifyOtpDto;

    try {
      await this.usersService.validatePasswordResetOtp(email, otp);
      return true;
    } catch (error) {
      throw new BadRequestException("Invalid or expired OTP");
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const { email, otp, password } = resetPasswordDto;

    try {
      await this.usersService.validatePasswordResetOtp(email, otp);

      await this.usersService.resetPassword(email, password);

      await this.usersService.clearPasswordResetOtp(email);

      return true;
    } catch (error) {
      throw new BadRequestException("Invalid or expired OTP");
    }
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateProfile(userId, {
      ...updateProfileDto,
    });

    return updatedUser;
  }

  async uploadProfilePhoto(userId: string, file: BufferedFile): Promise<User> {
    let profilePhotoUrl: string;

    try {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      profilePhotoUrl = uploadResult; // Assumes uploadImage returns secure_url
    } catch (error) {
      throw new BadRequestException("Failed to upload profile photo");
    }

    const updatedUser = await this.usersService.updateProfile(userId, {
      profilePhoto: profilePhotoUrl,
    });

    return updatedUser;
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    return user;
  }
}