import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNoteInput } from './dto/create-note.input';
import { RenameNoteInput } from './dto/rename-note.input';
import { assertCanEdit, assertIsCreator } from '../common/authorization';
import { slugify } from 'src/common/slugify';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async findNotes(userId: string, folderId?: string) {
    if (folderId) {
      // Owner’s folder-specific notes
      return this.prisma.note.findMany({
        where: { 
          ownerId: userId,
          deletedAt: null, 
          folderId,
        },
        orderBy: { sortOrder: 'asc' },
      });
    }

    // Root view: own loose notes + notes shared with me
    return this.prisma.note.findMany({
      where: {
        deletedAt: null,
        OR: [
          // Own loose notes (folderId = null)
          { ownerId: userId, folderId: null },
          // Notes shared with me as collaborator
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

    if (
      note.ownerId !== userId &&
      !note.collaborators.some((c) => c.userId === userId)
    ) {
      throw new ForbiddenException('No access to this note');
    }

    return note;
  }

  async findByUrl(userId: string, url: string, folderId?: string | null) {
  return this.prisma.note.findFirst({
    where: {
      ownerId: userId,
      url,
      ...(folderId !== undefined && folderId !== null ? { folderId } : {}),
    },
  });
}

async createNote(userId: string, input: CreateNoteInput) {
  const baseSlug = slugify(input.title) || 'untitled';
  let slug = baseSlug;
  let counter = 1;

  // Keep incrementing until unique within same folder scope
  while (
    await this.prisma.note.findFirst({
    where: {
        ownerId: userId,
        folderId: input.folderId ?? null,
        url: slug,
      },
    })
  ) {
    slug = `${baseSlug}_${counter++}`;
  }

  // create AFTER loop
  return this.prisma.note.create({
    data: {
      ownerId: userId,
      title: input.title,
      folderId: input.folderId ?? null,
      color: input.color ?? '#A8D1E7',
      url: slug,
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


async renameNote(userId: string, input: RenameNoteInput) {
    console.log("!! Note:", input);
    const note = await this.prisma.note.findUnique({
      where: { id: input.id },
      include: { collaborators: true },
    });
    
    if (!note) throw new NotFoundException('Note not found');

    assertCanEdit(userId, note);

    // Generate new slug based on new title
    const baseSlug = slugify(input.title) || 'untitled';
    let slug = baseSlug;
    let counter = 1;

    // Avoid collisions within same folder (exclude current note)
    while (
      await this.prisma.note.findFirst({
        where: {
          ownerId: userId,
          folderId: note.folderId ?? null,
          url: slug,
          NOT: { id: note.id },
        },
      })
    ) {
      slug = `${baseSlug}_${counter++}`;
    }

    return this.prisma.note.update({
      where: { id: note.id },
      data: {
        title: input.title,
        url: slug,
      },
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
    // Check permissions first (owner or collaborator with edit access)
    for (const { id } of items) {
      const note = await this.findOne(userId, id); // already includes collaborators
      assertCanEdit(userId, note);
    }

    // Then run transaction only with raw Prisma updates
    const ops = items.map(({ id, sortOrder }) =>
      this.prisma.note.update({
        where: { id },
        data: { sortOrder },
      }),
    );

    await this.prisma.$transaction(ops);
    return this.findNotes(userId, folderId ?? undefined);
  }

  async updateNoteContent(userId: string, id: string, contentText?: string, contentJson?: Prisma.InputJsonValue) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { collaborators: true },
    });
    if (!note) throw new NotFoundException('Note not found');
    assertCanEdit(userId, note);

    // Always store some JSON so the column is never null
    const finalJson: Prisma.InputJsonValue =
      contentJson !== undefined
        ? (contentJson as unknown as Prisma.InputJsonValue)
        : (note.contentJson ??
            ({
              type: 'doc',
              content: contentText
                ? [{ type: 'paragraph', content: [{ type: 'text', text: contentText }] }]
                : [],
            } as Prisma.InputJsonValue));

    return this.prisma.note.update({
      where: { id: note.id },
      data: {
        contentText: contentText ?? note.contentText,
        contentJson: finalJson,
      },
    });
  }

}
