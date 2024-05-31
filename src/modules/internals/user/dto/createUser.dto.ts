import { Transform } from 'class-transformer';
import UserLevel from '@/common/enum/userLevel.enum';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\s+/g, '_').toLowerCase())
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsNotEmpty()
  @IsString()
  level: UserLevel;

  @IsString()
  @IsNotEmpty()
  nationality: string;
}

export default CreateUserDto;
