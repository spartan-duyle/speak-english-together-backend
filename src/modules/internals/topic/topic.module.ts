import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { TopicRepository } from '@/modules/internals/topic/topic.repository';

@Module({
  imports: [],
  controllers: [TopicController],
  providers: [TopicService, PrismaService, TopicRepository],
  exports: [TopicService, TopicRepository],
})
export class TopicModule {}
