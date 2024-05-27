import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { RedisCacheService } from '@/redis/redis-cache.service';
import { FileService } from '@/modules/internals/file/file.service';
import { GoogleTranslateService } from '@/modules/externals/google-translate/google-translate.service';

@Injectable()
export class GoogleSpeechService {
  private ttsClient: TextToSpeechClient;

  constructor(
    private readonly cacheService: RedisCacheService,
    private readonly fileService: FileService,
    private readonly googleTranslateService: GoogleTranslateService,
  ) {
    this.ttsClient = new TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async textToSpeech(text: string): Promise<string> {
    try {
      const cacheKey = `audio:${text}`;
      const cachedAudioUrl = await this.cacheService.get(cacheKey);

      if (cachedAudioUrl) {
        return cachedAudioUrl;
      }

      // detect language
      const detectedLanguage =
        await this.googleTranslateService.detectLanguage(text);

      // get the voice language code
      const [voiceLanguageCode] = await this.ttsClient.listVoices({
        languageCode: detectedLanguage,
      });

      const [response] = await this.ttsClient.synthesizeSpeech({
        input: { text: text },
        voice: {
          languageCode:
            voiceLanguageCode?.voices[0]?.languageCodes[0] || 'en-US',
          ssmlGender: 'NEUTRAL',
        },
        audioConfig: { audioEncoding: 'MP3' },
      });

      // The audio content is in a binary format (Buffer)
      // Ensure audioContent is a Buffer
      const audioContent = Buffer.isBuffer(response.audioContent)
        ? response.audioContent
        : Buffer.from(response.audioContent as Uint8Array);

      // Upload the audio content to Firebase Storage
      const audioUrl = await this.fileService.uploadAudio(audioContent);

      // Cache the audio URL for 1 day
      await this.cacheService.set(cacheKey, audioUrl, 86400); // Cache for 1 day

      return audioUrl;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to generate audio: ${error.message}`,
      );
    }
  }
}
