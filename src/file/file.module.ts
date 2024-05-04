import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { FileController } from './file.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
