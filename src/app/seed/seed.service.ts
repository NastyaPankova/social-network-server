import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../entities/user/user.model';
import { Role } from '../../entities/role/role.model';
import { Post } from '../../entities/post/post.model';
import { UserService } from '../../entities/user/user.service';
import { RoleService } from '../../entities/role/role.service';
import { defPosts, defRoles, defUsers } from './data';
import { PostService } from '../../entities/post/post.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(Post) private postModel: typeof Post,
    private userService: UserService,
    private roleService: RoleService,
    private postService: PostService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedUsers();
    await this.seedPosts();
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
    //todo
    //есть ли что-то вроде ifAny?
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
      for (const [index, post] of defPosts.entries()) {
        await this.postService.createPost({
          ...post,
          authorId: index + 1,
        });
      }
    }
    console.log('Add Posts');
  }
}
