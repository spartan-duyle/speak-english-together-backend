import { UserPayload } from '@/authentication/types/user.payload';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class RoomRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async byId(id: number) {
    return this.prismaService.room.findUnique({
      where: {
        id,
        deleted_at: null,
        ended_at: null,
      },
    });
  }

  // async addRoom(data: any) {
  //   return this.prismaService.room.create({
  //     data: {
  //       name: data.name,
  //       is_private: data.isPrivate,
  //       is_group: data.isGroup,
  //       is_read_only: data.isReadOnly,
  //     },
  //   });
  // }

  async create(data: any, user: UserPayload, videoSDKRoomId: string) {
    return this.prismaService.room.create({
      data: {
        name: data.name,
        host_user_id: user.id,
        topic_id: data.topicId ? data.topicId : null,
        is_private: data.isPrivate,
        description: data.description,
        password: data.password,
        thumbnail: data.thumbnail,
        max_member_amount: data.maxMemberAmount,
        current_member_amount: 1,
        level: data.level || 'BEGINNER',
        room_members: {
          create: [
            {
              user_id: user.id,
              is_host: true,
              avatar_url: user.avatar_url,
              full_name: user.full_name,
              is_muted: true,
            },
          ],
        },
        video_sdk_room_id: videoSDKRoomId,
      },
    });
  }

  async updateCurrentMemberAmount(id: number, currentMemberAmount: number) {
    return this.prismaService.room.update({
      where: { id },
      data: {
        current_member_amount: currentMemberAmount,
        updated_at: new Date(),
      },
    });
  }

  async getActiveRooms(
    page: number,
    perPage: number,
    search: string,
    topicId: number,
  ) {
    const whereClause: Prisma.RoomWhereInput = {
      ended_at: null,
      deleted_at: null,
      name: {
        contains: search,
      },
      ...(topicId && { topic_id: topicId }),
    };

    const rooms = await this.prismaService.room.findMany({
      where: whereClause,
      include: {
        room_members: {
          where: {
            left_at: null,
            deleted_at: null,
          },
        },
        topic: {
          where: {
            deleted_at: null,
          },
        },
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        created_at: 'desc',
      },
    });

    const total = await this.prismaService.room.count({
      where: whereClause,
    });

    return {
      data: rooms,
      total,
    };
  }

  async endRoom(id: number) {
    return this.prismaService.room.update({
      where: { id },
      data: {
        ended_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
        current_member_amount: 0,
      },
    });
  }

  async getRoomDetails(id: number) {
    return this.prismaService.room.findUnique({
      where: {
        id: id,
        deleted_at: null,
        ended_at: null,
      },
      include: {
        room_members: {
          where: {
            left_at: null,
            deleted_at: null,
          },
        },
        topic: {
          where: {
            deleted_at: null,
          },
        },
      },
    });
  }
}
