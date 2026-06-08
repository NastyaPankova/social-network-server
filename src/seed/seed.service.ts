import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { Role } from '../role/role.model';
import { roleValues } from '../data/roleValues';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedUsers();
  }

  private async seedRoles() {
    //todo
    //есть ли что-то вроде ifAny?
    const count = await this.roleModel.count();

    if (count === 0) {
      const defRoles = [
        { value: roleValues.ROLE_USER },
        { value: roleValues.ROLE_ADMIN },
      ];

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
      const defUsers = [
        { email: 'user1@mail.com', password: 'pass1', name: 'name1'},
        { email: 'user2@mail.com', password: 'pass2', name: 'name2' },
      ];

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
}
