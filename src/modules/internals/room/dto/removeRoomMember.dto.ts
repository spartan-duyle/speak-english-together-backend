import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class RemoveRoomMemberDto {
  @ApiProperty({ type: Number, required: true, nullable: false })
  @IsNumber()
  @IsNotEmpty()
  room_id: number;

  @ApiProperty({ type: Number, required: true, nullable: false })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
