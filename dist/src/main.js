"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const multer = require("multer");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(multer({ dest: './uploads' }).any());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
    }));
    app.enableCors({
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Allow-Headers",
            "Access-Control-Request-Headers",
            "Access-Control-Allow-Origin",
        ],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
    });
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Freelance Platform API")
        .setDescription("API documentation for the Freelance Platform")
        .setVersion("1.0")
        .addTag("auth", "Authentication endpoints")
        .addTag("users", "User management endpoints")
        .addTag("projects", "Project management endpoints")
        .addTag("bids", "Project bidding endpoints")
        .addTag("contracts", "Contract management endpoints")
        .addTag("messages", "Messaging system endpoints")
        .addTag("milestones", "Milestone tracking endpoints")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
    }, "access-token")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map