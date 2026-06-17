import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeDto } from './dto/likeDto';
import { LikeService } from './like.service';

@ApiTags('Like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeServices: LikeService) {}

  //q
  //как передавать ID? Один через строку, другой через параметр?
//q
  //выбрать способ ставить лайк

 @ApiOperation({ summary: 'toggle' })
  @Post()
  toggleLike(@Body() dto: LikeDto) {
    return this.likeServices.toggleLike(dto);
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
