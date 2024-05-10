import { PrismaService } from '../prisma/prisma.serivce';
import AddRoomMemberDto from './dto/addRoomMember.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomMemberService {
  constructor(private readonly prismaService: PrismaService) {}

  async addRoomMember(data: AddRoomMemberDto) {
    await this.prismaService.roomMember.create({
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

  async byRoomIdAndUserId(roomId: number, userId: number) {
    return this.prismaService.roomMember.findFirst({
      where: {
        room_id: roomId,
        user_id: userId,
        deleted_at: null,
      },
    });
  }
}
