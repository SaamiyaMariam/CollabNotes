import { Module } from '@nestjs/common';
import { CollaboratorResolver } from './collaborator.resolver';
import { CollaboratorService } from './collaborator.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [CollaboratorResolver, CollaboratorService, PrismaService],
})
export class CollaboratorModule {}
