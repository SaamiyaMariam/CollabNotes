import { registerEnumType } from '@nestjs/graphql';
import { CollaboratorRole as PrismaCollaboratorRole } from '@prisma/client';

export type CollaboratorRole = PrismaCollaboratorRole;
export const CollaboratorRole = PrismaCollaboratorRole;

registerEnumType(CollaboratorRole, {
  name: 'CollaboratorRole',
});
