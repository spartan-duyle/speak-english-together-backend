import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '@/modules/internals/user/enum/userStatus.enum';
import UserLevel from '@/modules/internals/user/enum/userLevel.enum';

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

  async create(data: any) {
    return this.prismaService.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
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
}
