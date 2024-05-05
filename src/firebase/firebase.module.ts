import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirestoreRoomMemberService } from './firestoreRoomMember.service';

@Module({
  providers: [FirebaseService, FirestoreRoomMemberService],
  exports: [FirebaseService, FirestoreRoomMemberService],
})
export class FirebaseModule {}
