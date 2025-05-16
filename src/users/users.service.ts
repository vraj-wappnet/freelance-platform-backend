import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  /**
   * Create a new user with a unique user_id
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.usersRepository.findOneBy({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException("Email already exists");
      }

      // Generate a unique user_id (like UID12345)
      const generatedUserId = `UID${Math.floor(10000 + Math.random() * 90000)}`;

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Create and save the new user
      const newUser = this.usersRepository.create({
        ...createUserDto,
        user_id: generatedUserId,
        password: hashedPassword,
      });

      return this.usersRepository.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Error creating user");
    }
  }

  /**
   * Find all users with optional filtering
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    if (!["admin", "client", "freelancer"].includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    // Cast the string to the Role enum
    const users = await this.usersRepository.find({
      where: { role: role as any },
    });
    if (!users.length) {
      throw new NotFoundException(`No users found with role: ${role}`);
    }
    return users;
  }

  /**
   * Find a user by their internal id
   */
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  /**
   * Find a user by their public user_id
   */
  async findByUserId(userId: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id: userId });
    if (!user) {
      throw new NotFoundException(`User with user_id "${userId}" not found`);
    }
    return user;
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  /**
   * Update a user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Update user properties
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  /**
   * Set password reset OTP
   */
  async setPasswordResetOtp(email: string, otp: string): Promise<void> {
    const user = await this.findByEmail(email);

    // Hash the OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Set OTP and expiration (10 minutes)
    user.resetOtp = hashedOtp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.usersRepository.save(user);
  }

  /**
   * Validate password reset OTP
   */
  async validatePasswordResetOtp(email: string, otp: string): Promise<void> {
    const user = await this.findByEmail(email);

    // Check if OTP exists and has not expired
    if (
      !user.resetOtp ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      throw new BadRequestException("OTP is invalid or has expired");
    }

    // Compare OTP with stored hash
    const isValid = await bcrypt.compare(otp, user.resetOtp);
    if (!isValid) {
      throw new BadRequestException("Invalid OTP");
    }
  }

  /**
   * Clear password reset OTP
   */
  async clearPasswordResetOtp(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    // Clear OTP fields
    user.resetOtp = "";
    user.resetOtpExpires = null;

    await this.usersRepository.save(user);
  }

  /**
   * Reset password
   */
  async resetPassword(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);

    // Clear OTP fields
    user.resetOtp = "";
    user.resetOtpExpires = null;

    return this.usersRepository.save(user);
  }

  /**
   * Update refresh token
   */
  async setRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<void> {
    const user = await this.findById(userId);

    if (refreshToken) {
      // Hash the refresh token before storing
      user.refreshToken = await bcrypt.hash(refreshToken, 10);
    } else {
      user.refreshToken = "";
    }

    await this.usersRepository.save(user);
  }

  /**
   * Delete a user
   */
  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  async updateProfile(
    userId: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      location?: string;
      phone?: string;
      bio?: string;
      profilePhoto?: string;
    }
  ): Promise<User> {
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
}








  

 

 

 




