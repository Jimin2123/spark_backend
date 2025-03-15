import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  /**
   * Redis에 데이터를 저장
   * @param key - 저장할 키
   * @param value - 저장할 값 (문자열 또는 객체)
   * @param ttl - 만료 시간(초) (옵션)
   * @example
   * await redisService.set('user:123', { name: 'John' }, 3600);
   */
  async set<T extends string | object>(key: string, value: T, ttl?: number): Promise<void> {
    const storedValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, storedValue, 'EX', ttl);
    } else {
      await this.redisClient.set(key, storedValue);
    }
  }

  /**
   * Redis에서 데이터를 조회
   * @param key - 조회할 키
   * @returns 저장된 값 (객체 또는 문자열)
   * @example
   * const data = await redisService.get('user:123');
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`❌ Redis GET 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * Redis에서 특정 키 삭제
   * @param key - 삭제할 키
   * @example
   * await redisService.del('user:123');
   */
  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error(`❌ Redis DEL 실패: ${error.message}`);
    }
  }

  /**
   * 특정 키가 존재하는지 확인
   * @param key - 확인할 키
   * @returns 존재하면 true, 없으면 false
   * @example
   * const exists = await redisService.exists('user:123');
   */
  async exists(key: string): Promise<boolean> {
    try {
      return (await this.redisClient.exists(key)) === 1;
    } catch (error) {
      console.error(`❌ Redis EXISTS 실패: ${error.message}`);
      return false;
    }
  }

  /**
   * 여러 개의 키-값을 저장 (배치 저장)
   * @param data - 저장할 키-값 배열
   * @example
   * await redisService.multiSet([
   *  { key: 'user:123', value: { name: 'John' }, ttl: 3600 },
   *  { key: 'user:124', value: 'Hello' },
   * ]);
   */
  async multiSet(data: { key: string; value: any; ttl?: number }[]): Promise<void> {
    try {
      const pipeline = this.redisClient.multi();
      for (const { key, value, ttl } of data) {
        const storedValue = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttl) {
          pipeline.set(key, storedValue, 'EX', ttl);
        } else {
          pipeline.set(key, storedValue);
        }
      }
      await pipeline.exec();
    } catch (error) {
      console.error(`❌ Redis MULTI SET 실패: ${error.message}`);
    }
  }

  /**
   * 여러 개의 키에 대한 값을 조회
   * @param keys - 조회할 키 목록
   * @returns 키와 값이 매핑된 객체
   * @example
   * const values = await redisService.multiGet(['user:123', 'user:124']);
   */
  async multiGet(keys: string[]): Promise<{ [key: string]: any }> {
    try {
      const values = await this.redisClient.mget(...keys);
      return keys.reduce(
        (acc, key, index) => {
          acc[key] = values[index] ? JSON.parse(values[index]) : null;
          return acc;
        },
        {} as { [key: string]: any },
      );
    } catch (error) {
      console.error(`❌ Redis MULTI GET 실패: ${error.message}`);
      return {};
    }
  }

  /**
   * Sorted Set에 요소 추가
   * @param key - ZSET 키
   * @param score - 점수 (순위)
   * @param value - 저장할 값
   * @example
   * await redisService.zadd('leaderboard', 100, 'player1');
   */
  async zadd(key: string, score: number, value: string): Promise<void> {
    try {
      await this.redisClient.zadd(key, score, value);
    } catch (error) {
      console.error(`❌ Redis ZADD 실패: ${error.message}`);
    }
  }

  /**
   * Sorted Set에서 값 조회
   * @param key - ZSET 키
   * @param start - 시작 인덱스
   * @param end - 끝 인덱스 (기본: -1 = 전체 조회)
   * @returns 조회된 값 배열
   * @example
   * const topPlayers = await redisService.zrange('leaderboard', 0, 9);
   */
  async zrange(key: string, start = 0, end = -1): Promise<string[]> {
    try {
      return await this.redisClient.zrange(key, start, end);
    } catch (error) {
      console.error(`❌ Redis ZRANGE 실패: ${error.message}`);
      return [];
    }
  }

  /**
   * HashMap에 필드-값 저장
   * @param hash - 해시 키
   * @param key - 필드명
   * @param value - 저장할 값
   * @example
   * await redisService.hset('user:123', 'name', 'John Doe');
   */
  async hset(hash: string, key: string, value: any): Promise<void> {
    try {
      await this.redisClient.hset(hash, key, JSON.stringify(value));
    } catch (error) {
      console.error(`❌ Redis HSET 실패: ${error.message}`);
    }
  }

  /**
   * HashMap에서 필드 값 조회
   * @param hash - 해시 키
   * @param key - 필드명
   * @returns 저장된 값 (객체 또는 문자열)
   * @example
   * const name = await redisService.hget('user:123', 'name');
   */
  async hget<T>(hash: string, key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.hget(hash, key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`❌ Redis HGET 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * Redis 연결 종료 (애플리케이션 종료 시 실행)
   */
  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
