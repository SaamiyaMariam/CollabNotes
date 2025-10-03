import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
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
      data: { email, displayName, password: hash },
      select: { id: true, email: true }, // don’t return password
    });

    return this.issueTokens(user.id, user.email);
  }

  async login(email: string, password: string) {
    // select password only here
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.email);
  }

  async refresh(userId: string, tokenId: string) {
    const token = await this.prisma.refreshToken.findUnique({ where: { id: tokenId } });
    if (!token || token.userId !== userId || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.email, token.id);
  }

  private async issueTokens(userId: string, email: string, existingRefreshId?: string) {
    const accessToken = this.jwt.sign(
      { sub: userId, email },
      { secret: process.env.JWT_ACCESS_SECRET!, expiresIn: '15m' },
    );

    let refreshId = existingRefreshId;
    if (!refreshId) {
      const refresh = await this.prisma.refreshToken.create({
        data: {
          userId,
          tokenHash: '',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
        select: { id: true },
      });
      refreshId = refresh.id;
    }

    const refreshToken = this.jwt.sign(
      { sub: userId, tokenId: refreshId },
      { secret: process.env.JWT_REFRESH_SECRET!, expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  }
}
