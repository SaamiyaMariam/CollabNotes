import { InputType, Field } from '@nestjs/graphql';
import { CollaboratorRole } from './collaborator-role.enum';

@InputType()
export class AddCollaboratorInput {
  @Field()
  noteId!: string;

  @Field()
  userEmail!: string;

  @Field(() => CollaboratorRole, { defaultValue: CollaboratorRole.EDITOR })
  role!: CollaboratorRole;
}
