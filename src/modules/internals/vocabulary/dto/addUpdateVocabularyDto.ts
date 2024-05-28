import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleSentenceDto } from '@/modules/internals/vocabulary/dto/exampleSentence.dto';

export class AddUpdateVocabularyDto {
  @IsString()
  @ApiProperty({ type: 'string', description: 'Word to add', required: true })
  word: string;

  @ApiProperty({
    type: 'string',
    description: 'Audio URL of the source text',
    required: false,
  })
  @IsOptional()
  word_audio_url: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'Meaning of the word',
    required: true,
  })
  meaning: string;

  @ApiProperty({
    type: 'string',
    description: 'Audio URL of the output text',
    required: false,
  })
  @IsOptional()
  meaning_audio_url: string;

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

  @ApiProperty({
    type: 'number',
    description: 'Collection ID',
    required: false,
  })
  @IsOptional()
  collection_id: number;
}
