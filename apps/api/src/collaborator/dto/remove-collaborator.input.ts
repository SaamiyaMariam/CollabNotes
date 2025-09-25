import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class RemoveCollaboratorInput {
  @Field(() => ID)
  noteId!: string;

  @Field(() => ID)
  userId!: string;
}
