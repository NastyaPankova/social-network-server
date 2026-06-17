import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/createPostDto';
import { isExistsById } from '../../app/helpers/existModel';
import { User } from '../user/user.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    @InjectModel(User) private userRepository: typeof User,
    private userService: UserService,
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

  async createPost(dto: CreatePostDto) {
    await isExistsById(this.userRepository, dto.authorId);
    const date = new Date();
    const new_post = await this.postRepository.create({ ...dto, date: date });

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
}
