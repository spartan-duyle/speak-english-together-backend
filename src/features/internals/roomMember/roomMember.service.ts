import AddRoomMemberDto from './dto/addRoomMember.dto';
import { Injectable } from '@nestjs/common';
import RoomMemberRepository from '@/features/internals/roomMember/roomMember.repository';

@Injectable()
export class RoomMemberService {
  constructor(private readonly roomMemberRepository: RoomMemberRepository) {}

  async addRoomMember(data: AddRoomMemberDto) {
    await this.roomMemberRepository.addRoomMember(data);
  }

  async byRoomIdAndUserId(roomId: number, userId: number) {
    return this.roomMemberRepository.byRoomIdAndUserId(roomId, userId);
  }

  async removeRoomMember(id: number) {
    return this.roomMemberRepository.removeRoomMember(id);
  }
}
