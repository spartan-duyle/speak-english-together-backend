import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { OpenaiService } from '@/modules/internals/openai/openai.service';
import { UserGuard } from '@/common/guards/auth.guard';
import { VerifyGuard } from '@/common/guards/verify.guard';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { UserPayload } from '@/authentication/types/user.payload';
import GenerateSpeakingQuestionDto from '@/modules/internals/openai/dto/generateSpeakingQuestion.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  GenerateSpeakingQuestionResponse
} from '@/modules/internals/openai/response/generateSpeakingQuestion.response';

@Controller('open-ai')
@ApiTags('OpenAI')
export class OpenAiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('generate-speaking-question')
  @HttpCode(200)
  @UseGuards(UserGuard, VerifyGuard)
  @ApiBody({ type: GenerateSpeakingQuestionDto })
  async generateSpeakingQuestion(
    @GetUser() user: UserPayload,
    @Body() data: GenerateSpeakingQuestionDto,
  ): Promise<GenerateSpeakingQuestionResponse> {
    const result = await this.openaiService.generateSpeakingQuestion(data);
    return {
      status: result.status,
      question: result.question || null,
      suggestions: result.suggestions || null,
    };
  }
}