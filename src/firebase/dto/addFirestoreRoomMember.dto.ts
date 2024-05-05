export class AddFirestoreRoomMemberDto {
  roomId: number;
  fullName: string;
  avatarUrl: string;
  userId: number;
  isHost: boolean;
  isMuted: boolean;
}