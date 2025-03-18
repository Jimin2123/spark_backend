import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TossPaymentMethod } from 'src/common/enums/toss-payment-method.enum';

export class TossPaymentDto {
  @ApiProperty({ description: '결제수단', example: '카드' })
  @IsEnum(TossPaymentMethod)
  @IsNotEmpty()
  method: TossPaymentMethod;

  @ApiProperty({ description: '결제할 금액', example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: '구매상품명', example: '테스트 주문' })
  @IsString()
  @IsNotEmpty()
  orderName: string;
}
