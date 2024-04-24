import { Module } from '@nestjs/common';
import UserService from './user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
