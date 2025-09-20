import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [DocumentResolver, DocumentService, PrismaService],
})
export class DocumentModule {}
