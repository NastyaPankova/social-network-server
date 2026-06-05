import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../role/role.model';
import { User } from '../user/user.model';
import { SeedService } from './seed.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Role]), UserModule, RoleModule],
  providers: [SeedService],
})
export class SeedModule {}
