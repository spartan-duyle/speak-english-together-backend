import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { RedisCacheService } from '@/redis/redis-cache.service';

@Module({
  providers: [OpenaiService, RedisCacheService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
