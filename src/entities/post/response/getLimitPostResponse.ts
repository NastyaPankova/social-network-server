import { PagingDataDto } from '../dto/pagingDataDto';
import { PostWithLikes } from '../dto/postWithLikesDto';

export class GetLimitPostResponse {
  posts: PostWithLikes[];
  pagingData: PagingDataDto;
}
