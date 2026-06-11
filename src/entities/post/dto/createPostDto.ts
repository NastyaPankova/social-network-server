import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'New Title' })
  readonly title: string;
  //q
  //не должно быть даты? автоматически?
  //readonly date: Date;
  @ApiProperty({ example: 'New Content' })
  readonly content: string;
  @ApiProperty({ example: 'New URL' })
  readonly media: string;
  @ApiProperty({ example: '1' })
  readonly authorId: number;
}
