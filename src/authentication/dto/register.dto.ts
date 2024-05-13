import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import UserLevel from 'src/features/internals/user/enum/userLevel.enum';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  full_name: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, nullable: false })
  level: UserLevel;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  nationality: string;
}

export default RegisterDto;
