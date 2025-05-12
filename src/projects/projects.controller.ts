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
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/roles.enum";
import { Request } from "express";

// Define the shape of the user object attached to the request
interface UserRequest extends Request {
  user: {
    id: string;
    // Add other user properties if needed
  };
}

@ApiTags("projects")
@Controller("projects")
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.CLIENT, Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a new project" })
  @ApiResponse({
    status: 201,
    description: "The project has been successfully created.",
  })
  create(@Req() req: UserRequest, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, createProjectDto);
  }

  @Get()
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get all projects with optional filtering" })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by project status",
  })
  @ApiQuery({
    name: "skills",
    required: false,
    description: "Filter by skills (comma-separated)",
  })
  @ApiQuery({
    name: "clientId",
    required: false,
    description: "Filter by client ID",
  })
  @ApiResponse({
    status: 200,
    description: "Return all projects matching criteria",
  })
  findAll(
    @Query("status") status?: string,
    @Query("skills") skillsString?: string,
    @Query("clientId") clientId?: string
  ) {
    const skills = skillsString ? skillsString.split(",") : undefined;
    return this.projectsService.findAll(status, skills, clientId);
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get project by ID" })
  @ApiParam({ name: "id", description: "Project ID" })
  @ApiResponse({
    status: 200,
    description: "Return the project",
  })
  @ApiResponse({ status: 404, description: "Project not found." })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update project" })
  @ApiParam({ name: "id", description: "Project ID" })
  @ApiResponse({
    status: 200,
    description: "The project has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Project not found." })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: UserRequest,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return this.projectsService.update(id, req.user.id, updateProjectDto);
  }

  @Delete(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete project" })
  @ApiParam({ name: "id", description: "Project ID" })
  @ApiResponse({
    status: 200,
    description: "The project has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Project not found." })
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: UserRequest) {
    return this.projectsService.remove(id, req.user.id);
  }
}
