import AddRoomMemberDto from './dto/addRoomMember.dto';
import { Injectable } from '@nestjs/common';
import RoomMemberRepository from '@/modules/internals/roomMember/roomMember.repository';

@Injectable()
export class RoomMemberService {
  constructor(private readonly roomMemberRepository: RoomMemberRepository) {}

  async addRoomMember(data: AddRoomMemberDto) {
    return await this.roomMemberRepository.addRoomMember(data);
  }

  async byRoomIdAndUserId(roomId: number, userId: number) {
    return await this.roomMemberRepository.byRoomIdAndUserId(roomId, userId);
  }

  async removeRoomMember(id: number) {
    return await this.roomMemberRepository.removeRoomMember(id);
  }

  async isUserJoiningAnotherRoom(userId: number) {
    return await this.roomMemberRepository.isUserJoiningAnotherRoom(userId);
  }
}
