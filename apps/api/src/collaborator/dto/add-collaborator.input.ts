import { InputType, Field } from '@nestjs/graphql';
import { CollaboratorRole } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(CollaboratorRole, {
  name: 'CollaboratorRole',
});

@InputType()
export class AddCollaboratorInput {
  @Field()
  noteId!: string;

  @Field()
  userEmail!: string;

  @Field(() => CollaboratorRole, { defaultValue: CollaboratorRole.EDITOR })
  role!: CollaboratorRole;
}