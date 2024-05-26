import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TextToSpeechDto } from '@/google-speech/dto/textToSpeech.dto';
import { GoogleSpeechService } from '@/google-speech/google-speech.service';
import { VerifyGuard } from '@/common/guards/verify.guard';
import { UserGuard } from '@/common/guards/auth.guard';

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
}
