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
  ParseEnumPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MilestonesService } from "./milestones.service";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { UpdateMilestoneDto } from "./dto/update-milestone.dto";
import { MilestoneStatus } from "../common/enums/milestone-status.enum";
import { UserRequest } from "src/common/interfaces/user-request.interface";

@ApiTags("milestones")
@Controller("milestones")
@UseInterceptors(ClassSerializerInterceptor)
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a new milestone" })
  @ApiResponse({
    status: 201,
    description: "The milestone has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 400, description: "Bad Request." })
  create(
    @Req() req: UserRequest,
    @Body() createMilestoneDto: CreateMilestoneDto
  ) {
    return this.milestonesService.create(req.user.id, createMilestoneDto);
  }

  @Get()
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get all milestones with optional filtering" })
  @ApiQuery({
    name: "contractId",
    required: false,
    description: "Filter by contract ID",
  })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by milestone status",
    enum: MilestoneStatus,
  })
  @ApiResponse({
    status: 200,
    description: "Return all milestones matching criteria",
  })
  findAll(
    @Query("contractId") contractId?: string,
    @Query("status") status?: MilestoneStatus
  ) {
    return this.milestonesService.findAll(contractId, status);
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get milestone by ID" })
  @ApiParam({ name: "id", description: "Milestone ID" })
  @ApiResponse({
    status: 200,
    description: "Return the milestone",
  })
  @ApiResponse({ status: 404, description: "Milestone not found." })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.milestonesService.findOne(id);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update milestone" })
  @ApiParam({ name: "id", description: "Milestone ID" })
  @ApiResponse({
    status: 200,
    description: "The milestone has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Milestone not found." })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: UserRequest,
    @Body() updateMilestoneDto: UpdateMilestoneDto
  ) {
    return this.milestonesService.update(id, req.user.id, updateMilestoneDto);
  }

  @Delete(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete milestone" })
  @ApiParam({ name: "id", description: "Milestone ID" })
  @ApiResponse({
    status: 200,
    description: "The milestone has been successfully deleted.",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - only client or admin can delete a milestone.",
  })
  @ApiResponse({ status: 404, description: "Milestone not found." })
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: UserRequest) {
    return this.milestonesService.remove(id, req.user.id);
  }
}
