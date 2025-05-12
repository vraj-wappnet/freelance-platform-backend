import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project title',
    example: 'Website Development',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Need a responsive website built with React and Node.js',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Project budget',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  budget: number;

  @ApiProperty({
    description: 'Project deadline',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;

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