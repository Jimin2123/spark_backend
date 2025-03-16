import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly CACHE_PREFIX: string;
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.CACHE_PREFIX = this.configService.get<string>('CACHE_PREFIX', 'cache:');
  }

  /**
   * 캐시에 데이터 저장
   * @param key - 저장할 키
   * @param value - 저장할 값 (객체 가능)
   * @param ttl - 만료 시간 (초)
   */
  async setCache<T extends string | object>(key: string, value: T, ttl: number = 3600): Promise<void> {
    const fullKey = this.CACHE_PREFIX + key;
    try {
      const storedValue = typeof value === 'string' ? value : JSON.stringify(value); // 직렬화
      await this.redisService.set(fullKey, storedValue, ttl);
      this.logger.debug(`✅ Cache 저장: ${fullKey} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`❌ Cache 저장 실패: ${error.message}`);
    }
  }

  /**
   * 캐시에서 데이터 조회
   * @param key - 조회할 키
   * @returns 저장된 데이터 (없으면 null)
   */
  async getCache<T extends string | object>(key: string): Promise<T | null> {
    const fullKey = this.CACHE_PREFIX + key;
    try {
      const value = await this.redisService.get<T>(fullKey);
      if (!value) {
        this.logger.warn(`⚠️ Cache 미존재: ${fullKey}`);
        return null;
      }
      this.logger.debug(`✅ Cache 조회 성공: ${fullKey}`);
      return value;
    } catch (error) {
      this.logger.error(`❌ Cache 조회 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * 캐시에서 특정 키 삭제
   * @param key - 삭제할 키
   */
  async deleteCache(key: string): Promise<void> {
    const fullKey = this.CACHE_PREFIX + key;
    try {
      await this.redisService.del(fullKey);
      this.logger.debug(`✅ Cache 삭제: ${fullKey}`);
    } catch (error) {
      this.logger.error(`❌ Cache 삭제 실패: ${error.message}`);
    }
  }

  /**
   * 특정 캐시 키가 존재하는지 확인
   * @param key - 확인할 키
   * @returns 존재하면 true, 없으면 false
   */
  async existsCache(key: string): Promise<boolean> {
    const fullKey = this.CACHE_PREFIX + key;
    try {
      const exists = await this.redisService.exists(fullKey);
      return exists;
    } catch (error) {
      this.logger.error(`❌ Cache 존재 여부 확인 실패: ${error.message}`);
      return false;
    }
  }
}
