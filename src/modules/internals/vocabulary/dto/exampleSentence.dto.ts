import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExampleSentenceDto {
  @ApiProperty({ type: 'string', description: 'Example sentence' })
  @Expose()
  text: string;

  @ApiProperty({
    type: 'string',
    description: 'Translation of the example sentence',
  })
  @Expose()
  translation: string;
}
