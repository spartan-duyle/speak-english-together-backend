import { Module } from '@nestjs/common';
import { VocabularyController } from '@/modules/internals/vocabulary/vocabulary.controller';
import { VocabularyService } from '@/modules/internals/vocabulary/vocabulary.service';
import { VocabularyRepository } from '@/modules/internals/vocabulary/vocabulary.repository';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { GoogleSpeechModule } from '@/google-speech/google-speech.module';
import { VocabularyTopicRepository } from '@/modules/internals/vocabularyTopic/vocabularyTopic.repository';

@Module({
  imports: [PrismaModule, GoogleSpeechModule],
  controllers: [VocabularyController],
  providers: [VocabularyService, VocabularyRepository, VocabularyTopicRepository],
  exports: [VocabularyRepository, VocabularyService],
})
export class VocabularyModule {}
