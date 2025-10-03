import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    // JwtModule is required so AuthService & strategies can sign/verify tokens
    JwtModule.register({}),
  ],
  providers: [
    PrismaService,
    AuthService,
    AuthResolver,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
