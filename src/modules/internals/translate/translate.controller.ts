import { TranslateDto } from '@/modules/internals/translate/dto/translate.dto';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserGuard } from '@/common/guards/auth.guard';
import { VerifyGuard } from '@/common/guards/verify.guard';
import { OpenaiService } from '@/modules/externals/openai/openai.service';

@Controller('translate')
@ApiTags('translate')
@ApiBearerAuth()
export class TranslateController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('')
  @ApiBody({ type: TranslateDto })
  @ApiOkResponse({ type: String, description: 'Text translated successfully' })
  @UseGuards(UserGuard, VerifyGuard)
  @HttpCode(200)
  async translate(@Body() translateDto: TranslateDto) {
    const result = await this.openaiService.translateText(
      translateDto.text,
      translateDto.to,
    );

    return {
      status: result.status,
      meaning: result.meaning || null,
      examples: result.examples || null,
      context: result.context || null,
    };
  }
}
