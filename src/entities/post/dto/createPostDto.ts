
export class CreatePostDto {
  readonly title: string;
  readonly date: Date;
  readonly content: string;
  readonly media: string;
  readonly authorId: number;
}
