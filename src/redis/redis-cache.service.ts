import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async onModuleInit(): Promise<void> {
    try {
      console.log('REDIS_HOST:', process.env.REDIS_HOST || 'localhost');
      console.log('REDIS_PORT:', parseInt(process.env.REDIS_PORT, 10) || 6379);
      await this.cacheManager.set('connectionTest', 'success', 3600000);
      const value = await this.cacheManager.get('connectionTest');
      if (value === 'success') {
        console.log('Redis connection successful');
      } else {
        console.log('Redis connection failed');
      }
    } catch (error) {
      console.error('Redis connection failed', error);
    }
  }

  async get(key: string): Promise<any> {
    try {
      console.log('Cache get:', key);
      return await this.cacheManager.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      console.log('Cache set:', key);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
}
