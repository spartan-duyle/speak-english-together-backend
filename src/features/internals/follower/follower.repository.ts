import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.serivce';

@Injectable()
export default class FollowerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(data: any) {
    return this.prismaService.follower.create({
      data,
    });
  }

  async byFollowerIdAndFollowedId(followerId: number, followedId: number) {
    return this.prismaService.follower.findFirst({
      where: {
        follower_id: followerId,
        followed_id: followedId,
        deleted_at: null,
      },
    });
  }

  async delete(id: number) {
    return this.prismaService.follower.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async getFollowers(followedId: number, page: number, perPage: number) {
    const data = await this.prismaService.follower.findMany({
      where: {
        followed_id: followedId,
        deleted_at: null,
      },
      include: {
        follower: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const count = await this.prismaService.follower.count({
      where: {
        followed_id: followedId,
        deleted_at: null,
      },
    });

    return {
      data,
      total: count,
    };
  }

  async byFollowerId(userId: number) {
    return this.prismaService.follower.findMany({
      where: {
        follower_id: userId,
        deleted_at: null,
      },
    });
  }

  async getFollowing(userId: number, page: number, perPage: number) {
    const data = await this.prismaService.follower.findMany({
      where: {
        follower_id: userId,
        deleted_at: null,
      },
      include: {
        followed: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const count = await this.prismaService.follower.count({
      where: {
        follower_id: userId,
        deleted_at: null,
      },
    });

    return {
      data,
      total: count,
    };
  }
}
