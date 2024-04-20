import { Module } from '@nestjs/common';
import PostController from './post.controller';
import PostService from './post.service';
import { PrismaService } from 'src/prisma/prisma.serivce';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService, PrismaService],
  exports: [PostService],
})
export class PostModule {}
