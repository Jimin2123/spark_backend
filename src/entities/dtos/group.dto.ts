import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Purpose } from 'src/common/enums/purpose.enum';
import { UserGender } from 'src/common/enums/user-gender.enum';

export class CreateGroupMemberDto {
  @ApiProperty({ description: '멤버 별명', example: '철수' })
  @IsNotEmpty()
  @IsString()
  preset_name: string;

  @ApiProperty({ description: '성별', enum: UserGender, example: UserGender.MALE })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @ApiProperty({ description: '나이', example: 28 })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({ description: '선호 음식', example: '고기류' })
  @IsOptional()
  @IsString()
  food_preference?: string;

  @ApiProperty({ description: '채식 여부', example: false })
  @IsOptional()
  @IsBoolean()
  is_vegetarian?: boolean;

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

export class CreateGroupDto {
  @ApiProperty({ description: '그룹 이름', example: '친구모임' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '식사 목적', enum: Purpose, example: Purpose.FRIENDS })
  @IsOptional()
  @IsEnum(Purpose)
  purpose?: Purpose;

  @ApiProperty({ description: '그룹 멤버 정보', type: [CreateGroupMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGroupMemberDto)
  members: CreateGroupMemberDto[];
}
