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
import { BidsService } from "./bids.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import { UpdateBidDto } from "./dto/update-bid.dto";
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

@ApiTags("bids")
@Controller("bids")
@UseInterceptors(ClassSerializerInterceptor)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @Roles(Role.FREELANCER)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a new bid" })
  @ApiResponse({
    status: 201,
    description: "The bid has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({
    status: 409,
    description: "You have already placed a bid for this project.",
  })
  create(@Req() req: UserRequest, @Body() createBidDto: CreateBidDto) {
    return this.bidsService.create(req.user.id, createBidDto);
  }

  @Get()
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get all bids with optional filtering" })
  @ApiQuery({
    name: "projectId",
    required: false,
    description: "Filter by project ID",
  })
  @ApiQuery({
    name: "freelancerId",
    required: false,
    description: "Filter by freelancer ID",
  })
  @ApiResponse({
    status: 200,
    description: "Return all bids matching criteria",
  })
  findAll(
    @Query("projectId") projectId?: string,
    @Query("freelancerId") freelancerId?: string
  ) {
    return this.bidsService.findAll(projectId, freelancerId);
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get bid by ID" })
  @ApiParam({ name: "id", description: "Bid ID" })
  @ApiResponse({
    status: 200,
    description: "Return the bid",
  })
  @ApiResponse({ status: 404, description: "Bid not found." })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.bidsService.findOne(id);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update bid" })
  @ApiParam({ name: "id", description: "Bid ID" })
  @ApiResponse({
    status: 200,
    description: "The bid has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Bid not found." })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: UserRequest,
    @Body() updateBidDto: UpdateBidDto
  ) {
    return this.bidsService.update(id, req.user.id, updateBidDto);
  }

  @Delete(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete bid" })
  @ApiParam({ name: "id", description: "Bid ID" })
  @ApiResponse({
    status: 200,
    description: "The bid has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Bid not found." })
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: UserRequest) {
    return this.bidsService.remove(id, req.user.id);
  }
}
