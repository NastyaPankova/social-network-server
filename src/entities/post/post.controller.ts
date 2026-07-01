import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPostDto';
import { GetLimitPostResponse } from './response/getLimitPostResponse';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  // @ApiOperation({ summary: 'create post' })
  // @Post()
  // create(@Body() dto: CreatePostDto) {
  //   return this.postService.createPost(dto);
  // }

  @ApiOperation({ summary: 'create post' })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `post-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() dto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const pathToMedia = file ? file.filename : '';
    return this.postService.createPost(dto, pathToMedia);
  }

  @ApiOperation({ summary: 'delete post' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }

  //todo
  //guard
  @Get()
  async getLimitPosts(
    @Query('cursor') cursor?: string,
  ): Promise<GetLimitPostResponse> {
    return await this.postService.getLimitPosts(cursor);
  }
}
