import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../entities/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenModule } from '../entities/refreshToken/refreshToken.module';
import { TokenService } from './service/token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [JwtModule, AuthService],
  imports: [
    ConfigModule,
    RefreshTokenModule,
    JwtModule.register({
      global: true,
    }),
    forwardRef(() => UserModule),
    // JwtModule.register({
    //
    //   //todo
    //   //предлагается асинхронная загрузка токена
    //   // JwtModule.registerAsync({
    //   //   imports: [ConfigModule],
    //   //   useFactory: async (configService: ConfigService) => ({
    //   //     secret: configService.get<string>('JWT_SECRET'),
    //   //     signOptions: { expiresIn: '1h' },
    //   //   }),
    //   //   inject: [ConfigService],
    //   // })
    //   secret: process.env.JWT_PRIVATE_KEY || 'My_secret',
    //   //todo
    //   //изменить время expiresIn
    //   signOptions: {
    //     expiresIn: '24h',
    //   },
    // }),
  ],
})
export class AuthModule {}
