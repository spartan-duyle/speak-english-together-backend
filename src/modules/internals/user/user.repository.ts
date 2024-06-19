import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '@/common/enum/userStatus.enum';
import UserLevel from '@/common/enum/userLevel.enum';

@Injectable()
export default class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async byEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email, deleted_at: null },
    });
  }

  async markEmailAsConfirmed(email: string) {
    return this.prismaService.user.update({
      where: { email: email, deleted_at: null },
      data: { status: UserStatus.ACTIVE, updated_at: new Date() },
    });
  }

  async byId(id: number) {
    return this.prismaService.user.findUnique({
      where: { id: id, deleted_at: null },
      include: {
        followers: true,
        following: true,
      },
    });
  }

  async updateProfile(
    id: number,
    fullName: string,
    description: string,
    avatarUrl: string,
    level: UserLevel,
    nationality: string,
    birthday?: Date,
    nativeLanguage?: string,
    interests?: string[],
    learningGoals?: string[],
    occupation?: string,
  ) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        full_name: fullName,
        description: description,
        avatar_url: avatarUrl,
        level: level,
        nationality: nationality,
        updated_at: new Date(),
        birthday: birthday,
        native_language: nativeLanguage,
        interests: interests,
        learning_goals: learningGoals,
        occupation: occupation,
      },
    });
  }

  async updatePassword(id: number, password: string) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        password: password,
        updated_at: new Date(),
      },
    });
  }

  async create(data: any, cometChatUid: string) {
    return this.prismaService.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        comet_chat_uid: cometChatUid,
      },
    });
  }

  async getUsers(
    currentUserId: number,
    page: number,
    perPage: number,
    search: string,
  ) {
    const data = await this.prismaService.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        OR: [
          {
            full_name: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
        deleted_at: null,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        created_at: 'desc',
      },
    });

    const total = await this.prismaService.user.count({
      where: {
        id: {
          not: currentUserId,
        },
        OR: [
          {
            full_name: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
        deleted_at: null,
      },
    });

    return {
      data,
      total,
    };
  }

  async updateCometChatUid(id: number, cometChatUid: string) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        comet_chat_uid: cometChatUid,
      },
    });
  }
}
