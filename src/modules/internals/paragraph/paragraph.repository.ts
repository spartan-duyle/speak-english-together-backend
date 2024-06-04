import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QuestionLevelEnum } from '@/common/enum/questionLevel.enum';

@Injectable()
export default class ParagraphRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(
    userId: number,
    name: string,
    originalText: string,
    question?: string,
    audioUrl?: string,
    updatedText?: string,
    translatedUpdatedText?: string,
    relevanceToQuestion?: string,
    overallComment?: string,
    topicName?: string,
    level?: string,
    suggestionAnswers?: string[],
    suggestionImprovements?: string[],
  ) {
    const data: any = {
      question: question,
      name: name,
      user: {
        connect: {
          id: userId,
        },
      },
      original_text: originalText,
      audio_url: audioUrl,
      updated_text: updatedText,
      translated_updated_text: translatedUpdatedText,
      relevance_to_question: relevanceToQuestion,
      overall_comment: overallComment,
      level: level,
      suggestion_answers: suggestionAnswers,
      suggestion_improvements: suggestionImprovements,
      topic_name: topicName,
    };

    return this.prismaService.paragraph.create({
      data: data,
    });
  }

  async getAllParagraphs(
    userId: number,
    page: number,
    perPage: number,
    search: string,
    topicId: number,
    level: QuestionLevelEnum,
  ) {
    const whereClause: Prisma.ParagraphWhereInput = {
      user_id: userId,
      deleted_at: null,
      AND: [
        {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              original_text: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              topic_name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      ],
      ...(level && { level: level.toString().toUpperCase() }),
    };

    const data = await this.prismaService.paragraph.findMany({
      where: whereClause,
      take: perPage,
      skip: (page - 1) * perPage,
    });

    const total = await this.prismaService.paragraph.count({
      where: whereClause,
    });

    return {
      data,
      total,
    };
  }

  async getParagraphById(userId: number, paragraphId: number) {
    return this.prismaService.paragraph.findUnique({
      where: {
        id: paragraphId,
        user_id: userId,
        deleted_at: null,
      },
    });
  }

  async update(userId: number, paragraphId: number, name: string) {
    return this.prismaService.paragraph.update({
      where: {
        id: paragraphId,
        user_id: userId,
      },
      data: {
        name: name,
        updated_at: new Date(),
      },
    });
  }

  async deleteParagraph(userId: number, paragraphId: number) {
    return this.prismaService.paragraph.update({
      where: {
        id: paragraphId,
        user_id: userId,
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
