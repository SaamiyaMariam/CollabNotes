import { registerEnumType } from '@nestjs/graphql';

export enum CollaboratorRole {
  CREATOR = 'CREATOR',
  EDITOR = 'EDITOR',
}

registerEnumType(CollaboratorRole, {
  name: 'CollaboratorRole',
});
