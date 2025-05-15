// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsNotEmpty,
//   IsString,
//   IsNumber,
//   Min,
//   IsUUID,
// } from 'class-validator';

// export class CreateBidDto {
//   @ApiProperty({
//     description: 'Bid amount',
//     example: 1000,
//   })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(1)
//   amount: number;

//   @ApiProperty({
//     description: 'Delivery time in days',
//     example: 14,
//   })
//   @IsNotEmpty()
//   @IsNumber()
//   @Min(1)
//   deliveryTime: number;

//   @ApiProperty({
//     description: 'Proposal text',
//     example: 'I can deliver this project using React and Node.js...',
//   })
//   @IsNotEmpty()
//   @IsString()
//   proposal: string;

//   @ApiProperty({
//     description: 'Project ID',
//     example: '123e4567-e89b-12d3-a456-426614174000',
//   })
//   @IsNotEmpty()
//   @IsUUID()
//   project_id: string;
// }

// bids/dto/create-bid.dto.ts
import { IsNumber, IsString, IsNotEmpty, Min } from "class-validator";

export class CreateBidDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(1)
  deliveryTime: number;

  @IsString()
  @IsNotEmpty()
  proposal: string;

  @IsString()
  @IsNotEmpty()
  project_id: string;
}
