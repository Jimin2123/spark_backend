import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeORM.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';
import { BlacklistMiddleware } from './pipes/middlewares/black-list.middleware';
import { CommonModule } from './common.module';
import { RestrictionModule } from './apis/restriction/restriction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // 60초 동안
          limit: 10, // 최대 10회 요청 허용
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeORMConfig,
    }),
    UserModule,
    AuthModule,
    RedisModule,
    CommonModule,
    RestrictionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlacklistMiddleware).forRoutes('*'); // 모든 경로에 적용
  }
}
