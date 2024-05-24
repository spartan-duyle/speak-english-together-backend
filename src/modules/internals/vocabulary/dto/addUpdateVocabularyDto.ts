import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleSentenceDto } from '@/modules/internals/vocabulary/dto/exampleSentence.dto';

export class AddUpdateVocabularyDto {
  @IsString()
  @ApiProperty({ type: 'string', description: 'Word to add', required: true })
  word: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'Meaning of the word',
    required: true,
  })
  meaning: string;

  @ApiProperty({
    type: [ExampleSentenceDto],
    description: 'Examples of the word',
    required: false,
  })
  examples: ExampleSentenceDto[];

  @ApiProperty({
    type: 'string',
    description: 'Context of the word',
    required: false,
  })
  @IsOptional()
  context: string;
}
