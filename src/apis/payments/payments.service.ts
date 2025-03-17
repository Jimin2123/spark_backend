import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';
import { TossPaymentDto } from 'src/entities/dtos/payments.dto';
import { CoinService } from '../coin/coin.service';

@Injectable()
export class PaymentsService {
  private readonly baseUrl = 'https://api.tosspayments.com/v1/payments';
  private readonly tossSecretKey: string;
  private readonly tossClientKey: string;
  private readonly tossSuccessUrl: string;
  private readonly tossFailUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly coinService: CoinService,
  ) {
    this.tossSecretKey = this.configService.get<string>('TOSS_SECRET_KEY', '');
    this.tossClientKey = this.configService.get<string>('TOSS_CLIENT_KEY', '');
    this.tossSuccessUrl = this.configService.get<string>('TOSS_SUCCESS_URL', '');
    this.tossFailUrl = this.configService.get<string>('TOSS_FAIL_URL', '');
  }

  private getTossAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(this.tossSecretKey + ':', 'utf-8').toString('base64')}`,
    };
  }

  /**
   * 토스 결제 요청 API
   * @param userId
   * @param paylaod
   * @returns
   * @description 토스 결제 요청 API를 호출하여 결제 페이지 URL을 반환합니다.
   */
  async createTossPayment(userId: string, tossPaymentDto: TossPaymentDto) {
    const coinTransaction = await this.coinService.pendingCharge(userId, tossPaymentDto.amount); // 코인 충전 대기
    const data = {
      method: tossPaymentDto.method, // 결제수단
      amount: tossPaymentDto.amount, // 결제할 금액
      orderId: coinTransaction.uid, // 주문번호
      orderName: tossPaymentDto.orderName, // 주문명
      successUrl: this.tossSuccessUrl, // 결제 성공 URL
      failUrl: this.tossFailUrl, // 결제 실패 URL
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}`, data, { headers: this.getTossAuthHeaders() }),
      );
      return response.data; // checkoutPage URL 반환
    } catch (error) {
      console.error('Toss Payment API Error:', error.response?.data || error.message);
    }
  }

  /**
   * 토스 결제 승인 API
   * @param paymentKey
   * @param orderId
   * @param amount
   * @returns
   * @description 토스 결제 승인 API를 호출하여 결제를 승인합니다.
   */
  async aprroveTossPayment(paymentKey: string, orderId: string, amount: number) {
    const data = { paymentKey, orderId, amount };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/confirm`, data, { headers: this.getTossAuthHeaders() }),
      );
      await this.coinService.successCharge(orderId, paymentKey); // 코인 충전 성공 처리
      return response.data;
    } catch (error) {
      await this.coinService.failedCharge(orderId, paymentKey); // 코인 충전 실패 처리
      throw new Error(`결제 승인 실패: ${error.response?.data?.message || error.message}`);
    }
  }

  async failedTossPayment(orderId: string) {
    await this.coinService.failedCharge(orderId);
  }
}
