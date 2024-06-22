import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class RoomMemberRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async byRoomIdAndUserId(roomId: number, userId: number) {
    return this.prismaService.roomMember.findFirst({
      where: {
        room_id: roomId,
        user_id: userId,
        deleted_at: null,
      },
    });
  }

  async addRoomMember(data: any) {
    return this.prismaService.roomMember.create({
      data: {
        user_id: data.userId,
        room_id: data.roomId,
        is_host: data.isHost,
        avatar_url: data.avatarUrl,
        full_name: data.fullName,
        is_muted: data.isMuted,
      },
    });
  }

  async removeRoomMember(id: number) {
    return this.prismaService.roomMember.update({
      where: { id },
      data: { deleted_at: new Date(), updated_at: new Date(), is_host: false },
    });
  }

  async isUserJoiningAnotherRoom(userId: number) {
    const count = await this.prismaService.roomMember.count({
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });

    return count > 0;
  }

  async batchDelete(roomId: any) {
    return this.prismaService.roomMember.updateMany({
      where: {
        room_id: roomId,
      },
      data: {
        deleted_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async updateToNewHostMemberInRoom(roomId: any) {
    const roomMember = await this.findFirstMemberInRoom(roomId);

    return this.prismaService.roomMember.update({
      where: { id: roomMember.id },
      data: {
        is_host: true,
        updated_at: new Date(),
      },
    });
  }

  async findFirstMemberInRoom(roomId: number) {
    return this.prismaService.roomMember.findFirst({
      where: {
        room_id: roomId,
        deleted_at: null,
      },
    });
  }
}
