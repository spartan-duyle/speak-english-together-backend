import { Module } from '@nestjs/common';
import { GoogleSpeechService } from '@/google-speech/google-speech.service';
import { FileService } from '@/modules/internals/file/file.service';
import { FirebaseService } from '@/modules/externals/firebase/firebase.service';
import { GoogleSpeechController } from '@/google-speech/google-speech.controller';
import { GoogleTranslateModule } from '@/modules/externals/google-translate/google-translate.module';
import { RedisCacheModule } from '@/redis/redisCacheModule';

@Module({
  imports: [GoogleTranslateModule, RedisCacheModule],
  controllers: [GoogleSpeechController],
  providers: [GoogleSpeechService, FileService, FirebaseService],
  exports: [GoogleSpeechService],
})
export class GoogleSpeechModule {}
