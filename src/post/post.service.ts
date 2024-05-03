import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostNotFoundException } from './exceptions/postNotFound.exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'src/utils/prismaError';
import { PrismaService } from 'src/prisma/prisma.serivce';
import { PostModel } from './model/post.model';
import { plainToInstanceCustom } from 'src/helpers/helpers';

@Injectable()
export default class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPosts(): Promise<PostModel[]> {
    const posts = this.prismaService.post.findMany();
    return plainToInstanceCustom(PostModel, posts);
  }

  async getPostById(id: number): Promise<PostModel> {
    const post = await this.prismaService.post.findUnique({ where: { id } });
    if (!post) {
      throw new PostNotFoundException(id);
    }
    return plainToInstanceCustom(PostModel, post);
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostModel> {
    const post = this.prismaService.post.create({ data: createPostDto });
    return plainToInstanceCustom(PostModel, post);
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<PostModel> {
    try {
      const post = await this.prismaService.post.update({
        data: {
          ...updatePostDto,
          id: undefined,
        },
        where: {
          id,
        },
      });
      return plainToInstanceCustom(PostModel, post);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new PostNotFoundException(id);
      }
      throw error;
    }
  }

  async deletePost(id: number): Promise<PostModel> {
    try {
      const post = this.prismaService.post.delete({
        where: {
          id,
        },
      });
      return plainToInstanceCustom(PostModel, post);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new PostNotFoundException(id);
      }
      throw error;
    }
  }
}
