import { ForbiddenException } from '@nestjs/common';
import { Note, NoteCollaborator, CollaboratorRole } from '@prisma/client';

// Check if user can edit (CREATOR or EDITOR)
export function assertCanEdit(
  userId: string,
  note: Note & { collaborators: NoteCollaborator[] },
) {
  const collab = note.collaborators.find((c) => c.userId === userId);
  if (!collab) throw new ForbiddenException('No access');
  if (
    collab.role !== CollaboratorRole.CREATOR &&
    collab.role !== CollaboratorRole.EDITOR
  ) {
    throw new ForbiddenException('Not allowed to edit');
  }
}

// Check if user is the CREATOR
export function assertIsCreator(
  userId: string,
  note: Note & { collaborators: NoteCollaborator[] },
) {
  const collab = note.collaborators.find(
    (c) => c.userId === userId && c.role === CollaboratorRole.CREATOR,
  );
  if (!collab) throw new ForbiddenException('Only creator can perform this action');
}
