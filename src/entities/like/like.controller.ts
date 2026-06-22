import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeDto } from './dto/likeDto';
import { LikeService } from './like.service';
import * as authRequest from '../../auth/dto/authRequest';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('Like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeServices: LikeService) {}

  //q
  //как передавать ID? Один через строку, другой через параметр?
  //q
  //выбрать способ ставить лайк
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'toggle' })
  @Post(':id')
  async toggleLike(
    @Param('id', ParseIntPipe) postId: number,
    @Req() request: authRequest.AuthRequest,
  ) {
    const userId = request.user.id;
    const dto: LikeDto = {
      userId: userId,
      postId: postId,
    };
    return await this.likeServices.toggleLike(dto);
  }

  // @ApiOperation({ summary: 'set like' })
  // @Post()
  // setLike(@Body() dto: LikeDto) {
  //   console.log(dto);
  //   return this.likeServices.setLike(dto);
  // }
  //
  // @ApiOperation({ summary: 'remove like' })
  // @Delete()
  // removeLike(@Body() dto: LikeDto) {
  //   return this.likeServices.removeLike(dto);
  // }
}
