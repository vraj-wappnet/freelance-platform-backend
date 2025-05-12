import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { ProjectStatus } from '../../common/enums/project-status.enum';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'Project title',
    example: 'Website Development',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Need a responsive website built with React and Node.js',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Project budget',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  budget?: number;

  @ApiProperty({
    description: 'Project deadline',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiProperty({
    description: 'Project status',
    enum: ProjectStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({
    description: 'Required skills',
    example: ['React', 'Node.js', 'TypeScript'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({
    description: 'Project attachments URL',
    example: 'https://example.com/attachments',
    required: false,
  })
  @IsOptional()
  @IsString()
  attachments?: string;
}