import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'user1@mail.com' })
  readonly email: string;

  @ApiProperty({ example: 'pass1' })
  readonly password: string;
}
