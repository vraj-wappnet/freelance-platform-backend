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
import { ContractsService } from "./contracts.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/roles.enum";
import { ContractStatus } from "../common/enums/contract-status.enum";
import { UserRequest } from "src/common/interfaces/user-request.interface";

@ApiTags("contracts")
@Controller("contracts")
@UseInterceptors(ClassSerializerInterceptor)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Roles(Role.CLIENT)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a new contract" })
  @ApiResponse({
    status: 201,
    description: "The contract has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({
    status: 409,
    description: "Conflict - project already has an active contract.",
  })
  create(
    @Req() req: UserRequest,
    @Body() createContractDto: CreateContractDto
  ) {
    console.log("Creating contract with:", {
      userId: req.user.id,
      createContractDto,
    });
    return this.contractsService.create(req.user.id, createContractDto);
  }

  @Get()
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get all contracts with optional filtering" })
  @ApiQuery({
    name: "clientId",
    required: false,
    description: "Filter by client ID",
  })
  @ApiQuery({
    name: "freelancerId",
    required: false,
    description: "Filter by freelancer ID",
  })
  @ApiQuery({
    name: "projectId",
    required: false,
    description: "Filter by project ID",
  })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by contract status",
    enum: ContractStatus,
  })
  @ApiResponse({
    status: 200,
    description: "Return all contracts matching criteria",
  })
  findAll(
    @Query("clientId") clientId?: string,
    @Query("freelancerId") freelancerId?: string,
    @Query("projectId") projectId?: string,
    @Query("status") status?: ContractStatus
  ) {
    return this.contractsService.findAll(
      clientId,
      freelancerId,
      projectId,
      status
    );
  }

  @Get("user")
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Get contracts for the authenticated user (client or freelancer)",
  })
  @ApiResponse({
    status: 200,
    description:
      "Return all contracts where the user is either client or freelancer",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  findByUser(@Req() req: UserRequest) {
    return this.contractsService.findByUser(req.user.id);
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get contract by ID" })
  @ApiParam({ name: "id", description: "Contract ID" })
  @ApiResponse({
    status: 200,
    description: "Return the contract",
  })
  @ApiResponse({ status: 404, description: "Contract not found." })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.CLIENT, Role.FREELANCER, Role.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update contract" })
  @ApiParam({ name: "id", description: "Contract ID" })
  @ApiResponse({
    status: 200,
    description: "The contract has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Contract not found." })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: UserRequest,
    @Body() updateContractDto: UpdateContractDto
  ) {
    return this.contractsService.update(id, req.user.id, updateContractDto);
  }

  @Delete(":id")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete contract" })
  @ApiParam({ name: "id", description: "Contract ID" })
  @ApiResponse({
    status: 200,
    description: "The contract has been successfully deleted.",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - only client or admin can delete a contract.",
  })
  @ApiResponse({ status: 404, description: "Contract not found." })
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: UserRequest) {
    return this.contractsService.remove(id, req.user.id);
  }
}