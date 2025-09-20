import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
@Module({
  imports: [
    // JwtModule is required so AuthService & strategies can sign/verify tokens
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    AuthResolver,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GqlAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
