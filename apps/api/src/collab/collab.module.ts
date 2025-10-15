import { Module } from '@nestjs/common';
import { CollabGateway } from './collab.gateway';
import { YDocStateService } from './ydoc-state.service';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, JwtModule.register({}), ConfigModule],
  providers: [CollabGateway, YDocStateService],
})
export class CollabModule {}
