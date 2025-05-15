import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UserRequest } from "../common/interfaces/user-request.interface";

@ApiTags("messages")
@Controller("messages")
@UseInterceptors(ClassSerializerInterceptor)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a new message" })
  @ApiResponse({
    status: 201,
    description: "The message has been successfully created.",
  })
  create(@Req() req: UserRequest, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(req.user.id, createMessageDto);
  }

  @Get("conversation")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get conversation messages between two users" })
  @ApiResponse({
    status: 200,
    description: "List of messages in the conversation.",
  })
  getConversation(
    @Req() req: UserRequest,
    @Query("userId") userId: string,
    @Query("recipientId") recipientId: string
  ) {
    return this.messagesService.findConversation(userId, recipientId);
  }
}
