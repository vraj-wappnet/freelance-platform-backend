// import {
//   Controller,
//   Post,
//   Body,
//   Req,
//   Get,
//   Query,
//   UseInterceptors,
//   ClassSerializerInterceptor,
// } from "@nestjs/common";
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
// } from "@nestjs/swagger";
// import { MessagesService } from "./messages.service";
// import { CreateMessageDto } from "./dto/create-message.dto";
// import { UserRequest } from "../common/interfaces/user-request.interface";

// @ApiTags("messages")
// @Controller("messages")
// @UseInterceptors(ClassSerializerInterceptor)
// export class MessagesController {
//   constructor(private readonly messagesService: MessagesService) {}

//   @Post()
//   @ApiBearerAuth("access-token")
//   @ApiOperation({ summary: "Create a new message" })
//   @ApiResponse({
//     status: 201,
//     description: "The message has been successfully created.",
//   })
//   create(@Req() req: UserRequest, @Body() createMessageDto: CreateMessageDto) {
//     return this.messagesService.create(req.user.id, createMessageDto);
//   }

//   @Get("conversation")
//   @ApiBearerAuth("access-token")
//   @ApiOperation({ summary: "Get conversation messages between two users" })
//   @ApiResponse({
//     status: 200,
//     description: "List of messages in the conversation.",
//   })
//   getConversation(
//     @Req() req: UserRequest,
//     @Query("userId") userId: string,
//     @Query("recipientId") recipientId: string
//   ) {
//     return this.messagesService.findConversation(userId, recipientId);
//   }
// }

import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Patch,
  Param,
  Delete,
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
import { UpdateMessageDto } from "./dto/update-message.dto";
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

  @Patch(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update an existing message" })
  @ApiResponse({
    status: 200,
    description: "The message has been successfully updated.",
  })
  update(
    @Req() req: UserRequest,
    @Param("id") id: string,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    return this.messagesService.update(id, updateMessageDto, req.user.id);
  }

  @Delete(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete an existing message" })
  @ApiResponse({
    status: 200,
    description: "The message has been successfully deleted.",
  })
  delete(@Req() req: UserRequest, @Param("id") id: string) {
    return this.messagesService.remove(id, req.user.id);
  }
}