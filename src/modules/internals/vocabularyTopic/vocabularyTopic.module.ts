import { Module } from '@nestjs/common';
import { VocabularyTopicController } from '@/modules/internals/vocabularyTopic/vocabularyTopic.controller';
import { VocabularyTopicRepository } from '@/modules/internals/vocabularyTopic/vocabularyTopic.repository';
import { VocabularyTopicService } from '@/modules/internals/vocabularyTopic/vocabularyTopic.service';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { VocabularyModule } from '@/modules/internals/vocabulary/vocabulary.module';

@Module({
  imports: [VocabularyModule],
  controllers: [VocabularyTopicController],
  providers: [VocabularyTopicRepository, VocabularyTopicService, PrismaService],
  exports: [VocabularyTopicService],
})
export class VocabularyTopicModule {}
