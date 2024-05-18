export default class AddRoomMemberDto {
  userId: number;
  roomId: number;
  isHost: boolean = false;
  avatarUrl: string;
  fullName: string;
  isMuted: boolean = true;
}
