import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TextToSpeechDto } from '@/google-speech/dto/textToSpeech.dto';
import { GoogleSpeechService } from '@/google-speech/google-speech.service';
import { VerifyGuard } from '@/common/guards/verify.guard';
import { UserGuard } from '@/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('google-speech')
@ApiTags('Google Speech')
export class GoogleSpeechController {
  constructor(private readonly googleSpeechService: GoogleSpeechService) {}

  @Post('text-to-speech')
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBody({ type: TextToSpeechDto })
  @ApiOkResponse({ type: String, description: 'Audio URL' })
  @HttpCode(200)
  async recognize(@Body() data: TextToSpeechDto): Promise<string> {
    return this.googleSpeechService.textToSpeech(data.text);
  }

  @Post('speech-to-text')
  @UseGuards(UserGuard, VerifyGuard)
  @HttpCode(200)
  @Post()
  @UseGuards(UserGuard, VerifyGuard)
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: memoryStorage(),
    }),
  )
  @ApiOkResponse({ type: String, description: 'Transcription' })
  async handleUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const transcription = await this.googleSpeechService.speechToText(
      file.buffer,
    );
    return { transcription };
  }
}
