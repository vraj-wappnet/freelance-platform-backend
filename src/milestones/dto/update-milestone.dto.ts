import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { MilestoneStatus } from '../../common/enums/milestone-status.enum';

export class UpdateMilestoneDto {
  @ApiProperty({
    description: 'Milestone title',
    example: 'Frontend Implementation',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Milestone description',
    example: 'Complete the responsive UI implementation with React',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Milestone amount',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiProperty({
    description: 'Milestone due date',
    example: '2025-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    description: 'Milestone status',
    enum: MilestoneStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;

  @ApiProperty({
    description: 'Completion note',
    example: 'Completed all responsive UI components as requested',
    required: false,
  })
  @IsOptional()
  @IsString()
  completionNote?: string;

  @ApiProperty({
    description: 'Payment date',
    example: '2025-01-20',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}