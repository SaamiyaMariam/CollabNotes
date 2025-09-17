import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AuthResolver, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
