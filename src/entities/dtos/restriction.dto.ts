import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RestrictionType } from 'src/common/enums/restriction-type.enum';

export class CreateDietaryRestrictionDto {
  @ApiProperty({ description: '식이 제한 타입', enum: RestrictionType, example: RestrictionType.ALLERGY })
  @IsNotEmpty()
  @IsEnum(RestrictionType)
  restriction_type: RestrictionType;

  @ApiProperty({ description: '식이 제한 이름', example: '대두' })
  @IsNotEmpty()
  @IsString()
  restriction_name: string;

  @ApiProperty({ description: '식이 제한 설명', example: '대두 알레르기' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
