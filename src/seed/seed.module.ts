import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../entities/role/role.model';
import { User } from '../entities/user/user.model';
import { SeedService } from './seed.service';
import { UserModule } from '../entities/user/user.module';
import { RoleModule } from '../entities/role/role.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Role]), UserModule, RoleModule],
  providers: [SeedService],
})
export class SeedModule {}
