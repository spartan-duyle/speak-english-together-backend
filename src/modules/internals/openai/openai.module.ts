import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { RedisCacheService } from '@/redis/redis-cache.service';
import { OpenAiController } from '@/modules/internals/openai/open.ai.controller';

@Module({
  providers: [OpenaiService, RedisCacheService],
  exports: [OpenaiService],
  controllers: [OpenAiController],
})
export class OpenaiModule {}
