import { Module } from '@nestjs/common';
import { CollectionController } from '@/modules/internals/collection/collection.controller';
import { CollectionRepository } from '@/modules/internals/collection/collection.repository';
import { CollectionService } from '@/modules/internals/collection/collection.service';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { VocabularyModule } from '@/modules/internals/vocabulary/vocabulary.module';

@Module({
  imports: [VocabularyModule],
  controllers: [CollectionController],
  providers: [CollectionRepository, CollectionService, PrismaService],
  exports: [CollectionService],
})
export class CollectionModule {}
