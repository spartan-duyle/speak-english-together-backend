import { Injectable } from '@nestjs/common';
import { GoogleTranslateService } from '@/modules/externals/google-translate/google-translate.service';
import { LanguageResult } from '@google-cloud/translate/build/src/v2';

@Injectable()
export class TranslateService {
  constructor(
    private readonly googleTranslateService: GoogleTranslateService,
  ) {}

  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string,
  ): Promise<string> {
    return this.googleTranslateService.translateText(
      text,
      targetLanguage,
      sourceLanguage,
    );
  }

  async detectLanguage(text: string): Promise<string> {
    return this.googleTranslateService.detectLanguage(text);
  }

  async listSupportedLanguages(): Promise<LanguageResult[]> {
    return this.googleTranslateService.listSupportedLanguages();
  }
}