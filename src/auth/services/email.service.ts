import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<number>('EMAIL_PORT') === 465,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    otp: string,
  ): Promise<boolean> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Password Reset OTP',
      html: `
        <h1>Reset Your Password</h1>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Use the following OTP to reset it:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</p>
        <p>Enter this OTP in the password reset form to proceed.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>Best regards,<br>The Freelance Platform Team</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(
    to: string,
    name: string,
  ): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Welcome to the Freelance Platform',
      html: `
        <h1>Welcome to the Freelance Platform!</h1>
        <p>Hello ${name},</p>
        <p>Thank you for joining our platform. We're excited to have you with us!</p>
        <p><a href="${frontendUrl}/login" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Login to Your Account</a></p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Freelance Platform Team</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}