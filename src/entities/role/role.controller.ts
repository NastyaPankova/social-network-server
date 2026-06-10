import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleService } from './role.service';
import { RoleDto } from './dto/roleDto';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'create role' })
  @Post()
  create(@Body() dto: RoleDto) {
    return this.roleService.createRole(dto);
  }
  @ApiOperation({ summary: 'get role by value' })
  @Get(':value')
  getRoleByValue(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }
}
