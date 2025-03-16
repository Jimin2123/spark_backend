import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({ description: '도로명 주소', example: '서울시 강남구 강남대로 123' })
  @IsString()
  roadAddress: string;

  @ApiProperty({ description: '도로명 주소 전체', example: '서울시 강남구 강남대로 123' })
  @IsString()
  roadAddressFull: string;

  @ApiProperty({ description: '고객 입력 상세 주소', example: '강남빌딩 1234' })
  @IsString()
  detailAddress: string;

  @ApiProperty({ description: '참고 주소', example: '강남빌딩 1234' })
  @IsString()
  referenceAddress: string;

  @ApiProperty({ description: '영문 도로명 주소', example: '123, Gangnam-daero, Gangnam-gu, Seoul' })
  @IsString()
  roadAddressEnglish: string;

  @ApiProperty({ description: '지번 주소', example: '서울시 강남구 123-4' })
  @IsString()
  jibunAddress: string;

  @ApiProperty({ description: '우편번호', example: '12345' })
  @IsString()
  postalCode: string;
}
