import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(email: string, displayName: string, password: string) {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        displayName,
        password: hash,
      },
    });

    return this.issueTokens(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.email);
  }

  async refresh(userId: string, tokenId: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: { id: tokenId },
    });

    if (!token || token.userId !== userId || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.email, token.id);
  }

  private async issueTokens(userId: string, email: string, existingRefreshId?: string) {
    const accessToken = this.jwt.sign(
      { sub: userId, email },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
    );

    let refreshTokenId = existingRefreshId;
    if (!refreshTokenId) {
      const refresh = await this.prisma.refreshToken.create({
        data: {
          userId,
          tokenHash: '', // optional: hash refresh value later
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
        },
      });
      refreshTokenId = refresh.id;
    }

    const refreshToken = this.jwt.sign(
      { sub: userId, tokenId: refreshTokenId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  }
}
