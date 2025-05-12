import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  /**
   * Create a new message
   */
  async create(userId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const sender = await this.usersService.findById(userId);
    const recipient = await this.usersService.findById(createMessageDto.recipient_id);

    const message = this.messagesRepository.create({
      content: createMessageDto.content,
      sender,
      recipient,
    });

    return this.messagesRepository.save(message);
  }

  /**
   * Find all messages for a user (sent or received)
   */
  async findAll(userId: string, conversationWithId?: string): Promise<Message[]> {
    const queryBuilder = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .select([
        'message',
        'sender.id',
        'sender.user_id',
        'sender.firstName',
        'sender.lastName',
        'recipient.id',
        'recipient.user_id',
        'recipient.firstName',
        'recipient.lastName',
      ])
      .where('message.sender_id = :userId OR message.recipient_id = :userId', { 
        userId 
      })
      .orderBy('message.createdAt', 'DESC');

    // If conversation with specific user is requested
    if (conversationWithId) {
      queryBuilder.andWhere(
        '(message.sender_id = :conversationWithId AND message.recipient_id = :userId) OR ' +
        '(message.sender_id = :userId AND message.recipient_id = :conversationWithId)',
        { conversationWithId, userId }
      );
    }

    return queryBuilder.getMany();
  }

  /**
   * Find a message by id
   */
  async findOne(id: string, userId: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'recipient'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }

    // Ensure user is either sender or recipient
    if (message.sender.id !== userId && message.recipient.id !== userId) {
      throw new ForbiddenException('You do not have access to this message');
    }

    return message;
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.messagesRepository.count({
      where: {
        recipient_id: userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark message as read
   */
  async update(id: string, userId: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id, userId);
    
    // Only recipient can mark as read
    if (updateMessageDto.isRead !== undefined && message.recipient.id !== userId) {
      throw new ForbiddenException('Only the recipient can mark a message as read');
    }

    Object.assign(message, updateMessageDto);
    
    return this.messagesRepository.save(message);
  }

  /**
   * Delete a message
   */
  async remove(id: string, userId: string): Promise<void> {
    const message = await this.findOne(id, userId);
    const user = await this.usersService.findById(userId);

    // Check if the user is the sender, recipient, or admin
    if (message.sender.id !== userId && message.recipient.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You cannot delete this message');
    }

    await this.messagesRepository.remove(message);
  }
}