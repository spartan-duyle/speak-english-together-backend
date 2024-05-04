import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import serviceAccount from './speaking-english-together-firebase-service-account.json';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    const { project_id, client_email, private_key } = serviceAccount;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: project_id,
        clientEmail: client_email,
        privateKey: private_key,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
