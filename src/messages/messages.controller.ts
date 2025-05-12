import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { UserRequest } from "../common/interfaces/user-request.interface"; // Import shared interface

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

  @Get()
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get all messages for the current user" })
  @ApiQuery({
    name: "conversationWithId",
    required: false,
    description: "Filter messages to conversation with specific user",
  })
  @ApiResponse({
    status: 200,
    description: "Return all messages for the user",
  })
  findAll(
    @Req() req: UserRequest,
    @Query("conversationWithId") conversationWithId?: string
  ) {
    return this.messagesService.findAll(req.user.id, conversationWithId);
  }

  @Get("unread-count")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get count of unread messages" })
  @ApiResponse({
    status: 200,
    description: "Return count of unread messages",
  })
  getUnreadCount(@Req() req: UserRequest) {
    return this.messagesService.getUnreadCount(req.user.id);
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get message by ID" })
  @ApiParam({ name: "id", description: "Message ID" })
  @ApiResponse({
    status: 200,
    description: "Return the message",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Message not found." })
  findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: UserRequest) {
    return this.messagesService.findOne(id, req.user.id);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update message (mark as read)" })
  @ApiParam({ name: "id", description: "Message ID" })
  @ApiResponse({
    status: 200,
    description: "The message has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Message not found." })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: UserRequest,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    return this.messagesService.update(id, req.user.id, updateMessageDto);
  }

  @Delete(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete message" })
  @ApiParam({ name: "id", description: "Message ID" })
  @ApiResponse({
    status: 200,
    description: "The message has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Message not found." })
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: UserRequest) {
    return this.messagesService.remove(id, req.user.id);
  }
}
