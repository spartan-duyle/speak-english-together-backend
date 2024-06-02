import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ParagraphRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(
    userId: number,
    originalText: string,
    question?: string,
    audioUrl?: string,
    updatedText?: string,
    translatedUpdatedText?: string,
    relevanceToQuestion?: string,
    overallComment?: string,
  ) {
    return this.prismaService.paragraph.create({
      data: {
        question: question,
        user: {
          connect: {
            id: userId,
          },
        },
        original_text: originalText,
        audio_link: audioUrl,
        updated_text: updatedText,
        translated_updated_text: translatedUpdatedText,
        relevance_to_question: relevanceToQuestion,
        overall_comment: overallComment,
      },
    });
  }
}
