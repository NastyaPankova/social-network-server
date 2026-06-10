import { User } from '../../user/user.model';

export class postDto {
  readonly title: string;
  readonly date: Date;
  readonly content: string;
  readonly media: string;
  readonly author: User;
}
