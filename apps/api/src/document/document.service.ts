import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';

@Injectable()
export class DocumentService {
    constructor(private prisma: PrismaService) {}

    async createDocument(userId: string, input: CreateDocumentInput) {
        console.log("service logs");
        console.log("input: ", input);
        return this.prisma.document.create({
            data: {
                title: input.title ?? 'Untitled',
                parentId: input.parentId ?? null,
                ownerId: userId,
            },
        });
    }

    async fetchAllDocs(userId: string) {
        return this.prisma.document.findMany({
            where: { ownerId: userId },
            orderBy: { updatedAt: 'desc'},
        });
    }

    async findOne(userId: string, id: string) {
        const doc = await this.prisma.document.findFirst({where: { id }});
        if (!doc || doc.ownerId !== userId) {
            throw new NotFoundException('Document not found');
        }
        return doc;
    }

    async updateDocument(userId: string, input: UpdateDocumentInput) {
        const doc = await this.prisma.document.findFirst({where : { id: input.id } });
        if(!doc || doc.ownerId !== userId){
            throw new ForbiddenException('Not allowed to update this document');
        }
        return this.prisma.document.update({
            where: { id: input.id },
            data: {
                title: input.title ?? doc.title,
                parentId: input.parentId ?? doc.parentId,
            },
        });
    }

    async deleteDocument(userId: string, id: string) {
        const doc = await this.prisma.document.findUnique({ where: { id } });
        if(!doc || doc.ownerId !== userId) {
            throw new ForbiddenException('Not allowed to delete this document');
        }
        return this.prisma.document.delete({ where: { id } });
    }

}