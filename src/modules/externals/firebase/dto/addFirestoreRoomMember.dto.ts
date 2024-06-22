export class AddFirestoreRoomMemberDto {
  roomId: string;
  fullName: string;
  avatarUrl: string;
  userId: number;
  isHost: boolean;
}