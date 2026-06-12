import { ApiProperty } from '@nestjs/swagger';

export class LikeDto {
  @ApiProperty({ example: '1' })
  readonly userId: number;
  @ApiProperty({ example: '1' })
  readonly postId: number;
}
