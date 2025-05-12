import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({
    description: 'Message read status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}