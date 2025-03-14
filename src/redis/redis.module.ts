import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REDIS_SERVICE', // 클라이언트 식별 이름
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS, // 통신 방식 Redis로 지정
          options: {
            host: configService.get<string>('REDIS_HOST'), // 마이크로서비스 호스트
            port: configService.get<number>('REDIS_PORT'), // 마이크로서비스 포트
          },
        }),
      },
    ]),
  ],
  controllers: [RedisController],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
