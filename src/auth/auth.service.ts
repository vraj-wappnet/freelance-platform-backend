import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from './services/email.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Login user and generate tokens
   */
  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const tokens = await this.generateTokens(user);
    
    // Store refresh token
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

  /**
   * Generate JWT tokens (access and refresh)
   */
  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(userId: string, refreshToken: string): Promise<any> {
    try {
      const user = await this.usersService.findById(userId);
      
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Verify the refresh token matches
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      
      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      const tokens = await this.generateTokens(user);
      
      // Update refresh token in database
      await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
      
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(userId: string): Promise<boolean> {
    await this.usersService.setRefreshToken(userId, null);
    return true;
  }

  /**
   * Request password reset
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<boolean> {
    try {
      const { email } = forgotPasswordDto;
      
      // Find user and generate token
      const { token, user } = await this.usersService.setPasswordResetToken(email);
      
      // Send reset email
      const emailSent = await this.emailService.sendPasswordResetEmail(
        user.email,
        user.firstName,
        token,
      );
      
      return emailSent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        // For security reasons, don't reveal if the email exists
        return true;
      }
      throw error;
    }
  }

  /**
   * Reset password using token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const { email, token, password } = resetPasswordDto;
    
    try {
      // Validate reset token
      await this.usersService.validatePasswordResetToken(email, token);
      
      // Reset password
      await this.usersService.resetPassword(email, password);
      
      return true;
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }
}
