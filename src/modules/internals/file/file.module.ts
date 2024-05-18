import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FirebaseModule } from '../../externals/firebase/firebase.module';
import { FileController } from './file.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
