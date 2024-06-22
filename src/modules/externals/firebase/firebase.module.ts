import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirestoreService } from './firestore.service';

@Module({
  providers: [FirebaseService, FirestoreService],
  exports: [FirebaseService, FirestoreService],
})
export class FirebaseModule {}
