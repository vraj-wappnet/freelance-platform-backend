import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { ContractStatus } from '../../common/enums/contract-status.enum';

export class UpdateContractDto {
  @ApiProperty({
    description: 'Contract amount',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiProperty({
    description: 'Contract description',
    example: 'Development of a responsive website with React and Node.js',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Contract start date',
    example: '2025-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Contract end date',
    example: '2025-02-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Contract status',
    enum: ContractStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @ApiProperty({
    description: 'Client has accepted the contract',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  clientAccepted?: boolean;

  @ApiProperty({
    description: 'Freelancer has accepted the contract',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  freelancerAccepted?: boolean;
}