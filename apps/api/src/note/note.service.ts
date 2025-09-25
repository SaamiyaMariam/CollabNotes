import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNoteInput } from './dto/create-note.input';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async findNotes(userId: string, folderId?: string) {
    return this.prisma.note.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
        folderId: folderId ?? null,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.ownerId !== userId) throw new ForbiddenException();
    return note;
  }

  async createNote(userId: string, input: CreateNoteInput) {
    return this.prisma.note.create({
      data: {
        ownerId: userId,
        title: input.title,
        folderId: input.folderId ?? null,
      },
    });
  }

  async renameNote(userId: string, id: string, title: string) {
    const note = await this.findOne(userId, id);
    return this.prisma.note.update({ where: { id: note.id }, data: { title } });
  }

  async moveNote(userId: string, id: string, folderId?: string) {
    const note = await this.findOne(userId, id);
    return this.prisma.note.update({
      where: { id: note.id },
      data: { folderId: folderId ?? null },
    });
  }

  async setNoteColor(userId: string, id: string, color: string) {
    const note = await this.findOne(userId, id);
    return this.prisma.note.update({ where: { id: note.id }, data: { color } });
  }

  async deleteNote(userId: string, id: string) {
    const note = await this.findOne(userId, id);
    return this.prisma.note.update({
      where: { id: note.id },
      data: { deletedAt: new Date() },
    });
  }

  async reorderNotes(userId: string, folderId: string | null, items: { id: string; sortOrder: number }[]) {
    const ops = items.map(({ id, sortOrder }) =>
      this.prisma.note.updateMany({
        where: { id, ownerId: userId },
        data: { sortOrder },
      }),
    );
    await this.prisma.$transaction(ops);
    return this.findNotes(userId, folderId ?? undefined);
  }
}
