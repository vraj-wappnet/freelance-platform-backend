import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendPasswordResetEmail(to: string, name: string, token: string): Promise<boolean>;
    sendWelcomeEmail(to: string, name: string): Promise<boolean>;
}
