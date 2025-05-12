import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class UpdateBidDto {
  @ApiProperty({
    description: 'Bid amount',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiProperty({
    description: 'Delivery time in days',
    example: 14,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  deliveryTime?: number;

  @ApiProperty({
    description: 'Proposal text',
    example: 'I can deliver this project using React and Node.js...',
    required: false,
  })
  @IsOptional()
  @IsString()
  proposal?: string;

  @ApiProperty({
    description: 'Is bid shortlisted',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isShortlisted?: boolean;
}