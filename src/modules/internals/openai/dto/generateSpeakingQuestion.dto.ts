import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionLevelEnum } from '@/common/enum/questionLevel.enum';

export default class GenerateSpeakingQuestionDto {
  @ApiProperty({ type: String })
  @IsString()
  topic: string;

  @ApiProperty({ type: String })
  @IsString()
  level: QuestionLevelEnum;
}
