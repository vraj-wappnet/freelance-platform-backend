// import { ApiProperty } from "@nestjs/swagger";
// import { IsOptional, IsBoolean } from "class-validator";

// export class UpdateMessageDto {
//   @ApiProperty({
//     description: "Message read status",
//     example: true,
//   })
//   @IsOptional()
//   @IsBoolean()
//   isRead?: boolean;
// }
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsBoolean, IsString } from "class-validator";

export class UpdateMessageDto {
  @ApiProperty({
    description: "Message content",
    example: "Updated message content",
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: "Message read status",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}