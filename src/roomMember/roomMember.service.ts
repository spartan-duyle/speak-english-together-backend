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
        muted: data.muted,
      },
    });
  }
}
