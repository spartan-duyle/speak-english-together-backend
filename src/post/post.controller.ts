import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import PostService from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { FindOneParams } from 'src/utils/findOneParams';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostModel } from './model/post.model';

@Controller('post')
@ApiTags('posts')
export default class PostController {
  constructor(private readonly postsService: PostService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All posts have been successfully fetched',
    type: [PostModel],
  })
  async getPosts(): Promise<PostModel[]> {
    return this.postsService.getPosts();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a post that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A post has been successfully fetched',
    type: PostModel,
  })
  @ApiResponse({
    status: 404,
    description: 'A post with given id does not exist.',
  })
  getPostById(@Param() { id }: FindOneParams): Promise<PostModel> {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @ApiParam({
    name: 'post',
    required: true,
    description: 'Should be an object of type CreatePostDto',
    type: CreatePostDto,
  })
  @ApiResponse({
    status: 201,
    description: 'A post has been successfully created',
    type: PostModel,
  })
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a post that exists in the database',
    type: Number,
  })
  @ApiParam({
    name: 'post',
    required: true,
    description: 'Should be an object of type UpdatePostDto',
    type: UpdatePostDto,
  })
  @ApiResponse({
    status: 200,
    description: 'A post has been successfully updated',
    type: PostModel,
  })
  @ApiResponse({
    status: 404,
    description: 'A post with given id does not exist.',
  })
  async updatePost(
    @Param() { id }: FindOneParams,
    @Body() post: UpdatePostDto,
  ) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a post that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A post has been successfully deleted',
    type: PostModel,
  })
  @ApiResponse({
    status: 404,
    description: 'A post with given id does not exist.',
  })
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}
