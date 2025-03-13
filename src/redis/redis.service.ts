import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS_SERVICE') private readonly client: ClientRedis) {}

  async onModuleInit() {
    this.client
      .connect()
      .then(() => {
        this.logger.log('Connected to Redis');
      })
      .catch((err) => this.logger.error("Can't connect to Redis", err));
  }
}
