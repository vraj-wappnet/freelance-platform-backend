import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({
    description: "User email",
    example: "john.doe@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "6-digit OTP",
    example: "123456",
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp: string;
}
