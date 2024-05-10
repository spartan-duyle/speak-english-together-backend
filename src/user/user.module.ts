import { Module } from '@nestjs/common';
import UserService from './user.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
