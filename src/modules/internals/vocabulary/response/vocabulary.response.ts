import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ExampleSentenceDto } from '@/modules/internals/vocabulary/dto/exampleSentence.dto';

export class VocabularyResponse {
  @Expose()
  @ApiProperty({ type: 'number', description: 'Id of the word' })
  id: number;

  @Expose()
  @ApiProperty({ type: 'string', description: 'Word' })
  word: string;

  @Expose()
  @ApiProperty({ type: 'string', description: 'Meaning of the word' })
  meaning: string;

  @Expose()
  @ApiProperty({
    type: [ExampleSentenceDto],
    description: 'Examples of the word'
  })
  examples: ExampleSentenceDto[];

  @Expose()
  @ApiProperty({ type: 'string', description: 'Context of the word' })
  context: string;

  @Expose()
  @ApiProperty({ type: 'number', description: 'Id of the user' })
  user_id: number;
}
