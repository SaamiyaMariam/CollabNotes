import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddCollaboratorInput } from './dto/add-collaborator.input';
import { RemoveCollaboratorInput } from './dto/remove-collaborator.input';
import { Note } from 'src/note/entities/note.entity';
import { NoteCollaborator } from './entities/collaborator.entity';

function assertCanEdit(userId: string, note: Note & { collaborators: NoteCollaborator[] }) {
  const collab = note.collaborators.find(c => c.userId === userId);
  if (!collab) throw new ForbiddenException('No access');
  if (collab.role !== 'CREATOR' && collab.role !== 'EDITOR') {
    throw new ForbiddenException('Not allowed to edit');
  }
}


function assertIsCreator(userId: string, note: Note & { collaborators: NoteCollaborator[] }) {
  const collab = note.collaborators.find(c => c.userId === userId && c.role === 'CREATOR');
  if (!collab) throw new ForbiddenException('Only creator can perform this action');
}

@Injectable()
export class CollaboratorService {
  constructor(private prisma: PrismaService) {}

  async listCollaborators(userId: string, noteId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { collaborators: { include: { user: true } } },
    });
    if (!note) throw new NotFoundException('Note not found');
    if (note.ownerId !== userId) throw new ForbiddenException('Only owner can list collaborators');
    return note.collaborators;
  }

  async addCollaborator(userId: string, input: AddCollaboratorInput) {
    const note = await this.prisma.note.findUnique({
      where: { id: input.noteId },
      include: { owner: true },
    });
    if (!note) throw new NotFoundException('Note not found');
    if (note.ownerId !== userId) throw new ForbiddenException('Only owner can add collaborators');

    const user = await this.prisma.user.findUnique({ where: { email: input.userEmail } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.noteCollaborator.create({
      data: {
        noteId: input.noteId,
        userId: user.id,
        role: input.role,
        addedBy: userId,
      },
      include: { user: true, note: true },
    });
  }

  async removeCollaborator(userId: string, input: RemoveCollaboratorInput) {
    const note = await this.prisma.note.findUnique({ where: { id: input.noteId } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.ownerId !== userId) throw new ForbiddenException('Only owner can remove collaborators');

    return this.prisma.noteCollaborator.delete({
      where: {
        noteId_userId: {
          noteId: input.noteId,
          userId: input.userId,
        },
      },
    });
  }
}
