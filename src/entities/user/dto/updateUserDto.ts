import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'new_user@mail.com' })
  readonly email: string;

  @ApiProperty({ example: 'new_pass' })
  readonly password: string;

  @ApiProperty({ example: 'new_name_name' })
  readonly name: string;
}
