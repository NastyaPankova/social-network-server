import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionDto {
  @ApiProperty({ description: 'Kto', example: '1' })
  readonly followerId: number;
  @ApiProperty({ description: 'Na kogo', example: '2' })
  readonly followingId: number;
}
