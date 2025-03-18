import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReferenceType } from '../coin-history.entity';

export class SpendCoinDto {
  @ApiProperty({ description: '사용할 코인의 양', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: ReferenceType, description: '참조 유형', example: ReferenceType.GACHA })
  @IsEnum(ReferenceType)
  @IsNotEmpty()
  referenceType: ReferenceType;

  @ApiProperty({ description: '사용한 기계 ID', example: '1234' })
  @IsString()
  @IsNotEmpty()
  referenceId: string;
}
