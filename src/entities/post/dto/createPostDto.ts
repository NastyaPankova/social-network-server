import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'New Title' })
  readonly title: string;
  @ApiProperty({ example: 'New Content' })
  readonly content: string;
  @ApiProperty({ example: '1' })
  readonly authorId: number;
}
