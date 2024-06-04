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
    topicId?: number,
    level?: string,
    suggestionAnswers?: string[],
    suggestionImprovements?: string[],
  ) {
    console.log('suggestionsAnswers', suggestionAnswers);
    const data: any = {
      question: question,
      name: name,
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
      level: level,
      suggestion_answers: suggestionAnswers,
      suggestion_improvements: suggestionImprovements,
    };

    if (topicId) {
      data.topic = {
        connect: {
          id: topicId,
        },
      };
    }

    return this.prismaService.paragraph.create({
      data: data,
      include: {
        topic: true,
      },
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
          ],
        },
      ],
      ...(topicId && { topic_id: topicId }),
      ...(level && { level: level.toString().toUpperCase() }),
    };

    const data = await this.prismaService.paragraph.findMany({
      where: whereClause,
      include: {
        topic: {
          where: {
            deleted_at: null,
          },
        },
      },
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
}
