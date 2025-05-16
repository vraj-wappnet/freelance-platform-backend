// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { Message } from "./entities/message.entity";
// import { CreateMessageDto } from "./dto/create-message.dto";
// import { UsersService } from "../users/users.service";

// @Injectable()
// export class MessagesService {
//   constructor(
//     @InjectRepository(Message)
//     private messagesRepository: Repository<Message>,
//     private usersService: UsersService
//   ) {}

//   async create(
//     userId: string,
//     createMessageDto: CreateMessageDto
//   ): Promise<Message> {
//     const sender = await this.usersService.findById(userId);
//     const recipient = await this.usersService.findById(
//       createMessageDto.recipient_id
//     );

//     if (!sender || !recipient) {
//       throw new NotFoundException("Sender or recipient not found");
//     }

//     const message = this.messagesRepository.create({
//       content: createMessageDto.content,
//       sender,
//       recipient,
//       sender_id: userId,
//       recipient_id: createMessageDto.recipient_id,
//     });

//     return this.messagesRepository.save(message);
//   }

//   async findConversation(
//     userId: string,
//     recipientId: string
//   ): Promise<Message[]> {
//     return this.messagesRepository
//       .createQueryBuilder("message")
//       .leftJoinAndSelect("message.sender", "sender")
//       .leftJoinAndSelect("message.recipient", "recipient")
//       .where(
//         "((message.sender_id = :userId AND message.recipient_id = :recipientId) OR " +
//           "(message.sender_id = :recipientId AND message.recipient_id = :userId))",
//         { userId, recipientId }
//       )
//       .orderBy("message.createdAt", "ASC")
//       .getMany();
//   }
// }

import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private usersService: UsersService
  ) {}

  async create(
    userId: string,
    createMessageDto: CreateMessageDto
  ): Promise<Message> {
    const sender = await this.usersService.findById(userId);
    const recipient = await this.usersService.findById(
      createMessageDto.recipient_id
    );

    if (!sender || !recipient) {
      throw new NotFoundException("Sender or recipient not found");
    }

    const message = this.messagesRepository.create({
      content: createMessageDto.content,
      sender,
      recipient,
      sender_id: userId,
      recipient_id: createMessageDto.recipient_id,
    });

    return this.messagesRepository.save(message);
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ["sender", "recipient"],
    });
    if (!message) {
      throw new NotFoundException("Message not found");
    }
    return message;
  }

  async findConversation(
    userId: string,
    recipientId: string
  ): Promise<Message[]> {
    return this.messagesRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.recipient", "recipient")
      .where(
        "((message.sender_id = :userId AND message.recipient_id = :recipientId) OR " +
          "(message.sender_id = :recipientId AND message.recipient_id = :userId))",
        { userId, recipientId }
      )
      .orderBy("message.createdAt", "ASC")
      .getMany();
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
    userId: string
  ): Promise<Message> {
    const message = await this.findOne(id);
    if (message.sender_id !== userId) {
      throw new ForbiddenException("You can only update your own messages");
    }
    Object.assign(message, updateMessageDto);
    return this.messagesRepository.save(message);
  }

  async remove(id: string, userId: string): Promise<void> {
    const message = await this.findOne(id);
    if (message.sender_id !== userId) {
      throw new ForbiddenException("You can only delete your own messages");
    }
    await this.messagesRepository.delete(id);
  }
}