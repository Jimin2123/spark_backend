import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '닉네임', example: 'hong' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '나이', example: 30 })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({ description: '성별', example: true })
  @IsNotEmpty()
  @IsBoolean()
  gender: boolean;

  @ApiProperty({ description: '생년월일', example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birth?: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678' })
  @IsString()
  @IsOptional()
  phone?: string;
}
