import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import serviceAccount from './speaking-english-together-firebase-service-account.json';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;
  private readonly firestore: admin.firestore.Firestore;

  constructor() {
    const { project_id, client_email, private_key } = serviceAccount;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: project_id,
        clientEmail: client_email,
        privateKey: private_key,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    this.storage = admin.storage();
    this.firestore = admin.firestore();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }

  getFirestoreInstance(): admin.firestore.Firestore {
    return this.firestore;
  }
}
