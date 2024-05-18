import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { AddFirestoreRoomMemberDto } from './dto/addFirestoreRoomMember.dto';

@Injectable()
export class FirestoreRoomMemberService {
  constructor(private readonly firebaseService: FirebaseService) {}

  private firestore = this.firebaseService.getFirestoreInstance();

  private roomMembersCollection = this.firestore.collection('room_members');

  async addFirestoreRoomMember(data: AddFirestoreRoomMemberDto): Promise<void> {
    try {
      await this.roomMembersCollection.add({
        room_id: data.roomId,
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
        user_id: data.userId,
        is_host: data.isHost,
      });
    } catch (error) {
      throw new Error(
        `Failed to create room member document: ${error.message}`,
      );
    }
  }

  async deleteFirestoreRoomMember(
    roomId: number,
    userId: number,
  ): Promise<void> {
    try {
      const roomMember = await this.roomMembersCollection
        .where('room_id', '==', roomId)
        .where('user_id', '==', userId)
        .get();

      if (roomMember.empty) {
        throw new BadRequestException('Room member not found');
      }

      roomMember.forEach((doc) => {
        doc.ref.delete();
      });
    } catch (error) {
      throw new Error(
        `Failed to delete room member document: ${error.message}`,
      );
    }
  }

  async deleteFirestoreRoomMemberForHost(roomId: number): Promise<void> {
    try {
      const roomMember = await this.roomMembersCollection
        .where('room_id', '==', roomId)
        .get();

      if (roomMember.empty) {
        throw new BadRequestException('Room member not found');
      }

      roomMember.forEach((doc) => {
        doc.ref.delete();
      });
    } catch (error) {
      throw new Error(
        `Failed to delete room member document: ${error.message}`,
      );
    }
  }
}
