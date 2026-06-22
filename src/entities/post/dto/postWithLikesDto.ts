export interface PostWithLikes {
  id: number;
  title: string;
  createdAt: Date;
  content: string;
  media: string;
  author: { id: number; name: string };
  likesCount: number;
  isLiked: boolean;
}
