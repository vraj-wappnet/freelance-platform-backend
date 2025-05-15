import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
        throw new ConflictException('Email already exists');
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
      throw new InternalServerErrorException('Error creating user');
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
    // Import the Role enum at the top if not already imported
    // import { Role } from './entities/user.entity';
    if (!['admin', 'client', 'freelancer'].includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    // Cast the string to the Role enum
    const users = await this.usersRepository.find({ where: { role: role as any } });
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
   * Set password reset token
   */
  async setPasswordResetToken(email: string): Promise<{ token: string; user: User }> {
    const user = await this.findByEmail(email);

    // Generate a random token
    const token = uuidv4();

    // Set token and expiration (1 hour)
    user.passwordResetToken = await bcrypt.hash(token, 10);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersRepository.save(user);

    return { token, user };
  }

  /**
   * Validate password reset token
   */
  async validatePasswordResetToken(
    email: string,
    token: string,
  ): Promise<User> {
    const user = await this.findByEmail(email);

    // Check if token exists and has not expired
    if (
      !user.passwordResetToken ||
      user.passwordResetExpires < new Date()
    ) {
      throw new NotFoundException('Password reset token is invalid or has expired');
    }

    // Compare token with stored hash
    const isValid = await bcrypt.compare(token, user.passwordResetToken);
    if (!isValid) {
      throw new NotFoundException('Invalid password reset token');
    }

    return user;
  }

  /**
   * Reset password
   */
  async resetPassword(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);
    
    // Clear reset token fields
    user.passwordResetToken = '';
    user.passwordResetExpires = new Date(0);

    return this.usersRepository.save(user);
  }

  /**
   * Update refresh token
   */
  async setRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const user = await this.findById(userId);
    
    if (refreshToken) {
      // Hash the refresh token before storing
      user.refreshToken = await bcrypt.hash(refreshToken, 10);
    } else {
      user.refreshToken = '';
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
}