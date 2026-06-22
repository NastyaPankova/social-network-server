import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/createPostDto';
import { isExistsById } from '../../app/helpers/existModel';
import { User } from '../user/user.model';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import { PagingDataDto } from './dto/pagingDataDto';
import { GetLimitPostResponse } from './response/getLimitPostResponse';
import { Like } from '../like/like.model';
import { PostWithLikes } from './dto/postWithLikesDto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Like) private likeRepository: typeof Like,
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  //todo
  //сделать обновление и удаление постов с проверкой
  //пользователь, который редактирует или удаляет пост - его автор

  //q
  //глобальный вопрос об exception
  //в кокой момент лучше их кидать?
  //пример: user
  //в методе getUser... в любом случае возвращается
  //или user, или null
  //там, где нужен метод getUser,
  // после вызова getUser отрабатываются ситуации, когда
  //user есть и когда он null
  //лучше так или кидать exception в самом getUser???
  //

  //q
  //два варианта проверки существования пользователя
  //V1 - проверка внутри
  //V2 - проверка хелпером

  // async createPost(dto: CreatePostDto) {
  //   await isExistsById(this.userRepository, dto.authorId);
  //   const new_post = await this.postRepository.create({
  //     ...dto,
  //     createdAt: new Date(),
  //   });
  //
  //   return new_post;
  // }
  async createPost(dto: CreatePostDto, pathToMedia: string) {
    await isExistsById(this.userRepository, dto.authorId);
    const new_post = await this.postRepository.create({
      ...dto,
      createdAt: new Date(),
      media: pathToMedia,
    });

    return new_post;
  }

  //  V1 async createPost(dto: CreatePostDto) {
  //   const user = await this.userService.getUserById(dto.authorId);
  //
  //   if (!user) throw new NotFoundException(`User not found`);
  //   else
  //   {
  //     const date = new Date();
  //     const new_post = await this.postRepository.create({ ...dto, date: date });
  //
  //     return new_post;
  //   }
  // }

  async getPostById(id: number) {
    await isExistsById(this.postRepository, id);

    const post = await this.postRepository.findByPk(id);
    return post;
  }

  //V1 async getPostById(id: number) {
  //   const post = await this.postRepository.findByPk(id);
  //   if (!post) throw new NotFoundException(`Post not found`);
  //   return post;
  // }

  async getPostsByAuthor(authorId: number) {
    await isExistsById(this.userRepository, authorId);
    const posts = await this.postRepository.findAll({
      where: { authorId: authorId },
    });
    if (posts.length > 0) return posts;
    else throw new NotFoundException(`No posts found`);
  }

  // V1 async getPostsByAuthor(authorId: number) {
  //   const user = await this.userService.getUserById(authorId);
  //   if (!user) throw new NotFoundException(`User not found`);
  //   else {
  //     const posts = await this.postRepository.findAll({
  //       where: { authorId: authorId },
  //     });
  //     if (posts.length > 0) return posts;
  //     else throw new NotFoundException(`No posts found`);
  //   }
  // }

  //q
  //одновременное (поиск + удаление)
  async deletePost(id: number) {
    await isExistsById(this.postRepository, id);
    await this.postRepository.destroy({
      where: { id },
    });
  }

  async getLimitPosts(
    cursor?: string,
    userId?: number,
  ): Promise<GetLimitPostResponse> {
    const limit = Number(this.configService.get<string>('LIMIT') ?? 10);

    // 1. Формируем условие курсорной пагинации по времени
    const isRealCursor = cursor && cursor !== 'null' && cursor !== 'undefined';
    const whereCondition = isRealCursor
      ? { createdAt: { [Op.lt]: new Date(cursor) } }
      : {};

    // 2. Запрашиваем посты из БД (+1 запасной для проверки следующей страницы)
    const posts = await this.postRepository.findAll({
      where: whereCondition,
      limit: limit + 1,
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ],
    });

    const nextPage = posts.length > limit;
    const responsePosts = nextPage ? posts.slice(0, limit) : posts;

    // 3. Собираем ID постов, которые лайкнул текущий пользователь
    let userLikedPostIds: number[] = [];

    if (userId && responsePosts.length > 0) {
      const postIds = responsePosts.map((p) => p.id);

      const userLikes = await this.likeRepository.findAll({
        where: {
          userId,
          postId: { [Op.in]: postIds },
        },
        attributes: ['postId'],
      });

      userLikedPostIds = userLikes.map((like) => like.postId);
    }

    // 4. Мапим результат напрямую в массив типа PostWithLikes[] БЕЗ оператора "as"
    const formattedPosts: PostWithLikes[] = responsePosts.map((post) => {
      const plainPost = post.get({ plain: true });

      return {
        id: plainPost.id,
        title: plainPost.title,
        createdAt: plainPost.createdAt,
        content: plainPost.content,
        media: plainPost.media,
        author: {
          id: plainPost.author?.id || 0,
          name: plainPost.author?.name || 'anonymous',
        },
        likesCount: plainPost.likesCount,
        isLiked: userLikedPostIds.includes(plainPost.id),
      };
    });

    // 5. Расчет курсора для следующего запроса фронтенда
    const newCursor =
      formattedPosts.length > 0
        ? formattedPosts[formattedPosts.length - 1].createdAt
        : null;

    const pagingData: PagingDataDto = {
      cursor: newCursor ? new Date(newCursor).toISOString() : '',
      nextPage: nextPage,
    };

    const response: GetLimitPostResponse = {
      posts: formattedPosts,
      pagingData: pagingData,
    };
    return response;
  }
}
