import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPostDto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'get post by id' })
  @Get('id/:id')
  getPostById(@Param('id') id: number) {
    return this.postService.getPostById(id);
  }

  @ApiOperation({ summary: 'get post by author' })
  @Get('user/:id')
  getPostByAuthor(@Param('id') id: number) {
    return this.postService.getPostsByAuthor(id);
  }

  @ApiOperation({ summary: 'create post' })
  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postService.createPost(dto);
  }

  @ApiOperation({ summary: 'delete post' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }
}
