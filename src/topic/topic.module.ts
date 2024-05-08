import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { PrismaService } from '../prisma/prisma.serivce';

@Module({
  imports: [],
  controllers: [TopicController],
  providers: [TopicService, PrismaService],
})
export class TopicModule {}
