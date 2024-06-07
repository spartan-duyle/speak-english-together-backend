import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { RedisCacheService } from '@/redis/redis-cache.service';
import { FileService } from '@/modules/internals/file/file.service';
import { GoogleTranslateService } from '@/modules/externals/google-translate/google-translate.service';
import { protos, SpeechClient } from '@google-cloud/speech';

@Injectable()
export class GoogleSpeechService {
  private ttsClient: TextToSpeechClient;
  private speechClient: SpeechClient;

  constructor(
    private readonly cacheService: RedisCacheService,
    private readonly fileService: FileService,
    private readonly googleTranslateService: GoogleTranslateService,
  ) {
    this.ttsClient = new TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    this.speechClient = new SpeechClient({
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
      const audioUrl = (await this.fileService.uploadAudio(audioContent))
        .publicUrl;

      // Cache the audio URL for 1 day
      await this.cacheService.set(cacheKey, audioUrl, 86400 * 1000); // Cache for 1 day

      return audioUrl;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to generate audio: ${error.message}`,
      );
    }
  }

  async speechToText(audioBuffer: Buffer): Promise<{
    transcription: string;
    audioUrl: string;
  }> {
    try {
      const { publicUrl, gcsUri } =
        await this.fileService.uploadAudio(audioBuffer);

      const request: protos.google.cloud.speech.v1.ILongRunningRecognizeRequest =
        {
          audio: {
            uri: gcsUri,
          },
          config: {
            encoding:
              protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
                .MP3,
            sampleRateHertz: 16000,
            languageCode: 'en-US',
          },
        };

      const [response] = await this.speechClient.recognize(request);

      if (
        !response.results ||
        response.results.length === 0 ||
        response.results[0].alternatives[0].transcript.length === 0
      ) {
        throw new BadRequestException(
          'Cannot hear your speech, please try again',
        );
      }

      const transcript = response.results
        .map((result) => result.alternatives[0].transcript)
        .join('\n');
      return {
        transcription: transcript,
        audioUrl: publicUrl,
      };
    } catch (error) {
      return error;
    }
  }
}
