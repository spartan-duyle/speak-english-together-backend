import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { TopicRepository } from '@/features/internals/topic/topic.repository';

@Module({
  imports: [],
  controllers: [TopicController],
  providers: [TopicService, PrismaService, TopicRepository],
  exports: [TopicService],
})
export class TopicModule {}
