import { Module } from '@nestjs/common';
import { GoogleTranslateService } from '@/modules/externals/google-translate/google-translate.service';
import { Translate } from '@google-cloud/translate/build/src/v2';

@Module({
  providers: [GoogleTranslateService, Translate],
  exports: [GoogleTranslateService],
})
export class GoogleTranslateModule {}
