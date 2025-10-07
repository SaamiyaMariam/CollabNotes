import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateFolderInput } from './dto/create-folder.input';
import { slugify } from '../common/slugify';

@Injectable()
export class FolderService {
  constructor(private prisma: PrismaService) {}

  async findUserFolders(userId: string, rootOnly?: boolean) {
    return this.prisma.folder.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
        ...(rootOnly ? { parentId: null } : {}),
      },
      orderBy: { sortOrder: 'asc' },
      include: { notes: true },
    });
  }

  async findByUrl(userId: string, url: string) {
    return this.prisma.folder.findFirst({
      where: { ownerId: userId, url },
    });
  }

  async createFolder(userId: string, input: CreateFolderInput) {
    console.log("createFolder user:", userId);
    console.log("createFolder input:", input);

    const baseSlug = slugify(input.name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.folder.findFirst({
      where: { ownerId: userId, url: slug },
    })) {
      slug = `${baseSlug}_${counter++}`;
    }
    return this.prisma.folder.create({
      data: {
        ownerId: userId,
        name: input.name,
        color: input.color ?? "#f2bdd6",
        url: slug,
      },
    });
  }

  async renameFolder(userId: string, id: string, name: string) {
    const folder = await this.assertIsOwner(userId, id);

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.folder.findFirst({
      where: {
        ownerId: userId,
        url: slug,
        id: { not: id },
      },
    })) {
      slug = `${baseSlug}_${counter++}`;
    }

    return this.prisma.folder.update({
      where: { id: folder.id },
      data: { name, url: slug },
    });
  }

  async setFolderColor(userId: string, id: string, color: string) {
    const folder = await this.assertIsOwner(userId, id);
    return this.prisma.folder.update({
      where: { id: folder.id },
      data: { color },
    });
  }

  async deleteFolder(userId: string, id: string) {
    const folder = await this.assertIsOwner(userId, id);

    await this.prisma.$transaction([
      this.prisma.note.updateMany({
        where: { folderId: id },
        data: { deletedAt: new Date() },
      }),
      this.prisma.folder.update({
        where: { id: folder.id },
        data: { deletedAt: new Date() },
      }),
    ]);

    return folder;
  }

  async reorderFolders(userId: string, items: { id: string; sortOrder: number }[]) {
    const ops = items.map(({ id, sortOrder }) =>
      this.prisma.folder.updateMany({
        where: { id, ownerId: userId },
        data: { sortOrder },
      }),
    );
    await this.prisma.$transaction(ops);
    return this.prisma.folder.findMany({
      where: { ownerId: userId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  private async assertIsOwner(userId: string, folderId: string) {
    const folder = await this.prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder || folder.ownerId !== userId) {
      throw new ForbiddenException('Not the owner');
    }
    return folder;
  }
}
