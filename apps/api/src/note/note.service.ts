import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNoteInput } from './dto/create-note.input';
import { assertCanEdit, assertIsCreator } from '../common/authorization';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async findNotes(userId: string, folderId?: string) {
    return this.prisma.note.findMany({
      where: {
        deletedAt: null,
        folderId: folderId ?? null,
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { collaborators: true },
    });
    if (!note) throw new NotFoundException('Note not found');

    // allow creator or collaborators
    assertCanEdit(userId, note);
    return note;
  }

  async createNote(userId: string, input: CreateNoteInput) {
    // when creating a note, also insert creator into collaborators table
    return this.prisma.note.create({
      data: {
        ownerId: userId,
        title: input.title,
        folderId: input.folderId ?? null,
        collaborators: {
          create: {
            userId,
            role: 'CREATOR',
            addedBy: userId,
          },
        },
      },
      include: { collaborators: true },
    });
  }

  async renameNote(userId: string, id: string, title: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { collaborators: true },
    });
    if (!note) throw new NotFoundException('Note not found');
    assertCanEdit(userId, note);

    return this.prisma.note.update({
      where: { id: note.id },
      data: { title },
    });
  }

  async moveNote(userId: string, id: string, folderId?: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { collaborators: true },
    });
    if (!note) throw new NotFoundException('Note not found');
    assertCanEdit(userId, note);

    return this.prisma.note.update({
      where: { id: note.id },
      data: { folderId: folderId ?? null },
    });
  }

  async setNoteColor(userId: string, id: string, color: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { collaborators: true },
    });
    if (!note) throw new NotFoundException('Note not found');
    assertCanEdit(userId, note);

    return this.prisma.note.update({
      where: { id: note.id },
      data: { color },
    });
  }

  async deleteNote(userId: string, id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { collaborators: true },
    });
    if (!note) throw new NotFoundException('Note not found');
    assertIsCreator(userId, note);

    return this.prisma.note.update({
      where: { id: note.id },
      data: { deletedAt: new Date() },
    });
  }

  async reorderNotes(
    userId: string,
    folderId: string | null,
    items: { id: string; sortOrder: number }[],
  ) {
    // only reorder notes user has edit access to
    const ops = items.map(({ id, sortOrder }) =>
      this.prisma.note.updateMany({
        where: {
          id,
          deletedAt: null,
          OR: [
            { ownerId: userId },
            { collaborators: { some: { userId } } },
          ],
        },
        data: { sortOrder },
      }),
    );
    await this.prisma.$transaction(ops);
    return this.findNotes(userId, folderId ?? undefined);
  }
}
