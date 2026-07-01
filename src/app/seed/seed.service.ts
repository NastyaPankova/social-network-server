import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../entities/user/user.model';
import { Role } from '../../entities/role/role.model';
import { Post } from '../../entities/post/post.model';
import { UserService } from '../../entities/user/user.service';
import { RoleService } from '../../entities/role/role.service';
import { defLikes, defPosts, defRoles, defUsers } from '../data/data';
import { PostService } from '../../entities/post/post.service';
import { extname, join } from 'path';
import * as fs from 'node:fs';
import { Like } from '../../entities/like/like.model';
import { LikeService } from '../../entities/like/like.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(Like) private likeModel: typeof Like,
    private userService: UserService,
    private roleService: RoleService,
    private postService: PostService,
    private likeService: LikeService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedUsers();
    await this.seedPosts();
    await this.seedLikes();
  }

  private async seedRoles() {
    //todo
    //есть ли что-то вроде ifAny?
    const count = await this.roleModel.count();

    if (count === 0) {
      for (const role of defRoles) {
        await this.roleService.createRole(role);
      }
    }
    console.log('Add Roles');
  }

  private async seedUsers() {

    const count = await this.userModel.count();

    if (count === 0) {
      for (const user of defUsers) {
        await this.userService.createUser(user);
      }
      const user = await this.userService.getUserByEmail(defUsers[0].email);
      if (user instanceof User) {
        await this.userService.addAdminRoleToUser(user);
      }
    }
    console.log('Add Users');
  }

  private async seedPosts() {
    const count = await this.postModel.count();

    if (count === 0) {
      const seedAssetsDir = join(process.cwd(), 'seed_uploads');
      const uploadsDir = join(process.cwd(), 'uploads');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const usersCount = defUsers.length;
      let userId = 1;
      for (const [index, post] of defPosts.entries()) {
        let finalMediaName = '';
        const sourceFilePath = join(seedAssetsDir, post.media);

        if (post.media && fs.existsSync(sourceFilePath)) {

          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(post.media);
          finalMediaName = `post-${uniqueSuffix}${ext}`;


          const destinationFilePath = join(uploadsDir, finalMediaName);
          fs.copyFileSync(sourceFilePath, destinationFilePath);
        }

        userId = (index % usersCount) + 1;
        console.log(userId);
        await this.postService.createPost(
          {
            title: post.title,
            content: post.content,
            authorId: userId,
          },
          finalMediaName,
        );
      }
    }
    console.log('Add Posts');
  }

  private async seedLikes() {
    const count = await this.likeModel.count();

    if (count === 0) {
      for (const like of defLikes) {
        await this.likeService.toggleLike(like);
      }
    }
    console.log('Add Likes');
  }
}
