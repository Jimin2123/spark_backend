import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';
import { TossPaymentDto } from 'src/entities/dtos/payments.dto';

@Injectable()
export class PaymentsService {
  private readonly tossSecretKey: string;
  private readonly tossClientKey: string;
  private readonly tossSuccessUrl: string;
  private readonly tossFailUrl: string;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.tossSecretKey = this.configService.get<string>('TOSS_SECRET_KEY', '');
    this.tossClientKey = this.configService.get<string>('TOSS_CLIENT_KEY', '');
    this.tossSuccessUrl = this.configService.get<string>('TOSS_SUCCESS_URL', '');
    this.tossFailUrl = this.configService.get<string>('TOSS_FAIL_URL', '');
  }

  async createTossPayment(userId: string, paylaod: TossPaymentDto) {
    const { amount, method, orderName } = paylaod;
    const authHeader = `Basic ${Buffer.from(this.tossSecretKey + ':', 'utf-8').toString('base64')}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    };
    const user = await this.userService.findUserById(userId);

    const data = {
      method, // 결제수단
      amount, // 결제할 금액
      orderId: randomUUID(), // 주문번호
      orderName, // 주문명
      customerName: user.name, // 주문자 이름
      successUrl: this.tossSuccessUrl,
      failUrl: this.tossFailUrl,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post('https://api.tosspayments.com/v1/payments', data, { headers }),
      );
      return response.data; // checkoutPage URL 반환
    } catch (error) {
      console.error('Toss Payment API Error:', error.response?.data || error.message);
    }
  }
}
