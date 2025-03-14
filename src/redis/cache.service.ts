import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

/**
 * CacheService (Key-Value Store)
 * @description API 응답 캐싱, 세션 관리, 임시 데이터 저장 역할
 * Key-Value 형태의 데이터 저장소로 Redis를 사용
 */
@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * 캐시 저장
   * @param key 캐시 키
   * @param value 캐시 값
   * @param ttl 캐시 만료 시간 (초)
   */
  async setCache(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * 캐시 조회
   * @param key 캐시 키
   * @returns 캐시 값
   */
  async getCache(key: string): Promise<String | null> {
    return await this.cacheManager.get(key);
  }

  /**
   * 캐시 삭제
   * @param key 캐시 키
   * @returns 삭제 여부
   * @description 삭제 성공 시 true, 실패 시 false 반환
   */
  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
