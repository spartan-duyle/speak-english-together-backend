import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../../externals/firebase/firebase.service';
import slugify from 'slugify';
import path from 'node:path';

@Injectable()
export class FileService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const extension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, extension);
      const sanitizedBaseName = slugify(baseName.replace(/\s/g, '_'), {
        lower: true,
        strict: true,
      });

      const storagePath = `images/${Date.now()}_${sanitizedBaseName}${extension}`;
      return await this.uploadToFirebaseStorage(file.buffer, storagePath);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }
  }

  async uploadAudio(audioContent: Buffer): Promise<string> {
    try {
      const extension = '.mp3';
      const storagePath = `audio/${Date.now()}_${Math.random().toString(36).substring(7)}${extension}`;

      return await this.uploadToFirebaseStorage(audioContent, storagePath);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload audio file: ${error.message}`,
      );
    }
  }

  private async uploadToFirebaseStorage(
    fileBuffer: Buffer,
    storagePath: string,
  ): Promise<string> {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();

    return new Promise((resolve, reject) => {
      const blob = bucket.file(storagePath);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.on('finish', async () => {
        try {
          await blob.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        } catch (error) {
          reject(error);
        }
      });

      blobStream.end(fileBuffer);
    });
  }
}
