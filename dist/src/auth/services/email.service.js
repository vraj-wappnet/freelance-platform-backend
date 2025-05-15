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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: this.configService.get('EMAIL_PORT') === 465,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            },
        });
    }
    async sendPasswordResetEmail(to, name, otp) {
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM'),
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
        }
        catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
    async sendWelcomeEmail(to, name) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM'),
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
        }
        catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map