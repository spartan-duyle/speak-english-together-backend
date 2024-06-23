import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { AddFirestoreRoomMemberDto } from './dto/addFirestoreRoomMember.dto';
import { AddFirestoreRoomDto } from '@/modules/externals/firebase/dto/addFirestoreRoom.dto';

@Injectable()
export class FirestoreService {
  constructor(private readonly firebaseService: FirebaseService) {}

  private firestore = this.firebaseService.getFirestoreInstance();

  private roomMembersCollection = this.firestore.collection('room_members');

  private roomCollection = this.firestore.collection('rooms');

  async addFirestoreRoomMember(
    roomMemberId: string,
    data: AddFirestoreRoomMemberDto,
  ): Promise<void> {
    try {
      await this.roomMembersCollection.doc(roomMemberId).set({
        id: roomMemberId,
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
    roomId: string,
    userId: number,
  ): Promise<void> {
    try {
      const roomMembers = await this.roomMembersCollection
        .where('room_id', '==', roomId)
        .where('user_id', '==', userId)
        .get();

      if (roomMembers.empty) {
        throw new BadRequestException('Room member not found');
      }

      roomMembers.forEach((doc) => {
        doc.ref.delete();
      });
    } catch (error) {
      throw new Error(
        `Failed to delete room member document: ${error.message}`,
      );
    }
  }

  async deleteFirestoreRoomMemberForHost(roomId: string): Promise<void> {
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

  async addFirestoreRoom(data: AddFirestoreRoomDto): Promise<void> {
    try {
      await this.roomCollection.doc(data.roomId).set({
        id: data.roomId,
        name: data.name,
        current_member_amount: 1,
      });
    } catch (error) {
      throw new Error(`Failed to create room document: ${error.message}`);
    }
  }

  async updateCurrentMemberAmountInRoom(
    roomId: string,
    current_member_amount: number,
  ): Promise<void> {
    try {
      await this.roomCollection.doc(roomId).update({
        current_member_amount: current_member_amount,
      });
    } catch (err) {
      throw new Error(`Failed to update room member amount: ${err.message}`);
    }
  }

  async deleteFireStoreRoom(roomId: string) {
    try {
      await this.roomCollection.doc(roomId).delete();
    } catch (err) {
      throw new Error(`Failed to delete firestore room: ${err.message}`);
    }
  }

  async updateRoomMemberToHost(roomMemberId: string) {
    try {
      await this.roomMembersCollection.doc(roomMemberId).update({
        is_host: true,
      });
    } catch (err) {
      throw new Error(`Failed to update room member to hosy: ${err.message}`);
    }
  }
}
