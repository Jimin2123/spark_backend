import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';
import { UserGender } from 'src/common/enums/user-gender.enum';
import { UserActivityLevel } from 'src/common/enums/user-activity-level.enum';

export class CreateUserDto {
  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'example123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '닉네임', example: 'hong' })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '나이', example: 30 })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({ description: '성별', enum: UserGender, example: UserGender.MALE })
  @IsNotEmpty()
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty({ description: '키', example: 170 })
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty({ description: '몸무게', example: 60 })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({ description: '생년월일', example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birth_date?: string;

  @ApiProperty({ description: '활동 레벨', enum: UserActivityLevel, example: UserActivityLevel.LOW })
  @IsNotEmpty()
  @IsEnum(UserActivityLevel)
  activity_level: UserActivityLevel;

  @ApiProperty({ description: '주소 정보', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address: AddressDto;

  @ApiProperty({
    description: '음식 제약 사항 ID 배열',
    example: ['uuid-1234', 'uuid-5678'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  restrictions?: string[];
}
