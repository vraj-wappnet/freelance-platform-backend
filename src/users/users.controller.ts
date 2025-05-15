import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/roles.enum";
import { User } from "./entities/user.entity";

@ApiTags("users")
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
    type: User,
  })
  @ApiResponse({ status: 400, description: "Invalid input data." })
  @ApiResponse({ status: 409, description: "Email already exists." })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "Return all users",
    type: [User],
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  findAll() {
    return this.usersService.findAll();
  }

  @Get("by-role")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get users by role" })
  @ApiQuery({
    name: "role",
    required: true,
    enum: ["admin", "client", "freelancer"],
    description: "Filter users by role (e.g., client, freelancer)",
  })
  @ApiResponse({
    status: 200,
    description: "Return users matching the specified role",
    type: [User],
  })
  @ApiResponse({ status: 400, description: "Invalid role provided." })
  @ApiResponse({
    status: 404,
    description: "No users found for the specified role.",
  })
  findByRole(@Query("role") role: string) {
    return this.usersService.findByRole(role);
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "Return the user",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found." })
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Get("user-id/:userId")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get user by user_id" })
  @ApiParam({ name: "userId", description: "Public User ID (user_id)" })
  @ApiResponse({
    status: 200,
    description: "Return the user",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found." })
  findByUserId(@Param("userId") userId: string) {
    return this.usersService.findByUserId(userId);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update user" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully updated.",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found." })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete user" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "User not found." })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
