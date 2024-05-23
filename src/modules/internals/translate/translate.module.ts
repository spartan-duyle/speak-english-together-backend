import { Module } from '@nestjs/common';
import { TranslateService } from '@/modules/internals/translate/translate.service';
import { TranslateController } from '@/modules/internals/translate/translate.controller';
import { GoogleTranslateService } from '@/modules/externals/google-translate/google-translate.service';
import { Translate } from '@google-cloud/translate/build/src/v2';
import OpenAI from 'openai';
import { OpenaiService } from '@/modules/externals/openai/openai.service';
import { RedisCacheModule } from '@/redis/redisCacheModule';

@Module({
  providers: [
    TranslateService,
    GoogleTranslateService,
    Translate,
    OpenAI,
    OpenaiService,
  ],
  controllers: [TranslateController],
  imports: [RedisCacheModule],
})
export class TranslateModule {}
