import { Injectable } from '@nestjs/common';
import {
  LanguageResult,
  Translate,
} from '@google-cloud/translate/build/src/v2';
import serviceAccount from '@/modules/externals/firebase/speaking-english-together-firebase-service-account.json';

@Injectable()
export class GoogleTranslateService {
  constructor(private readonly translateClient: Translate) {
    const { project_id, client_email, private_key } = serviceAccount;

    // Initialize Google Translate client
    this.translateClient = new Translate({
      projectId: project_id,
      credentials: {
        client_email,
        private_key,
      },
    });
  }

  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string,
  ): Promise<string> {
    const [translation] = await this.translateClient.translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });
    return translation;
  }

  async detectLanguage(text: string): Promise<string> {
    const [detection] = await this.translateClient.detect(text);
    return detection.language;
  }

  async listSupportedLanguages(): Promise<LanguageResult[]> {
    const [languages] = await this.translateClient.getLanguages();
    return languages;
  }
}
