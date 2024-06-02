import { Module } from '@nestjs/common';
import { ParagraphController } from './paragraph.controller';
import { ParagraphService } from './paragraph.service';
import ParagraphRepository from '@/modules/internals/paragraph/paragraph.repository';
import { PrismaService } from '@/database/prisma/prisma.serivce';

@Module({
  controllers: [ParagraphController],
  providers: [ParagraphService, ParagraphRepository, PrismaService],
})
export class ParagraphModule {}
