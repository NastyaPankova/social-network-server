import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ example: 'new_user@mail.com' })
  readonly email: string;

  @ApiProperty({ example: 'new_pass' })
  readonly password: string;

  @ApiProperty({ example: 'new_name' })
  readonly name: string;
}
