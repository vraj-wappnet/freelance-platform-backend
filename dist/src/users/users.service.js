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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        try {
            const existingUser = await this.usersRepository.findOneBy({
                email: createUserDto.email,
            });
            if (existingUser) {
                throw new common_1.ConflictException("Email already exists");
            }
            const generatedUserId = `UID${Math.floor(10000 + Math.random() * 90000)}`;
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const newUser = this.usersRepository.create({
                ...createUserDto,
                user_id: generatedUserId,
                password: hashedPassword,
            });
            return this.usersRepository.save(newUser);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Error creating user");
        }
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findByRole(role) {
        if (!["admin", "client", "freelancer"].includes(role)) {
            throw new common_1.BadRequestException(`Invalid role: ${role}`);
        }
        const users = await this.usersRepository.find({
            where: { role: role },
        });
        if (!users.length) {
            throw new common_1.NotFoundException(`No users found with role: ${role}`);
        }
        return users;
    }
    async findById(id) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async findByUserId(userId) {
        const user = await this.usersRepository.findOneBy({ user_id: userId });
        if (!user) {
            throw new common_1.NotFoundException(`User with user_id "${userId}" not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findOneBy({ email });
        if (!user) {
            throw new common_1.NotFoundException(`User with email "${email}" not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async setPasswordResetOtp(email, otp) {
        const user = await this.findByEmail(email);
        const hashedOtp = await bcrypt.hash(otp, 10);
        user.resetOtp = hashedOtp;
        user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersRepository.save(user);
    }
    async validatePasswordResetOtp(email, otp) {
        const user = await this.findByEmail(email);
        if (!user.resetOtp ||
            !user.resetOtpExpires ||
            user.resetOtpExpires < new Date()) {
            throw new common_1.BadRequestException("OTP is invalid or has expired");
        }
        const isValid = await bcrypt.compare(otp, user.resetOtp);
        if (!isValid) {
            throw new common_1.BadRequestException("Invalid OTP");
        }
    }
    async clearPasswordResetOtp(email) {
        const user = await this.findByEmail(email);
        user.resetOtp = "";
        user.resetOtpExpires = null;
        await this.usersRepository.save(user);
    }
    async resetPassword(email, password) {
        const user = await this.findByEmail(email);
        user.password = await bcrypt.hash(password, 10);
        user.resetOtp = "";
        user.resetOtpExpires = null;
        return this.usersRepository.save(user);
    }
    async setRefreshToken(userId, refreshToken) {
        const user = await this.findById(userId);
        if (refreshToken) {
            user.refreshToken = await bcrypt.hash(refreshToken, 10);
        }
        else {
            user.refreshToken = "";
        }
        await this.usersRepository.save(user);
    }
    async remove(id) {
        const user = await this.findById(id);
        await this.usersRepository.remove(user);
    }
    async updateProfile(userId, updateData) {
        await this.usersRepository.update(userId, {
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            location: updateData.location,
            phone: updateData.phone,
            bio: updateData.bio,
            profilePhoto: updateData.profilePhoto,
        });
        return this.findById(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map