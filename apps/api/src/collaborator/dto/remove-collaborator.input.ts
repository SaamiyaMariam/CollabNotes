import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemoveCollaboratorInput {
  @Field()
  noteId!: string;

  @Field()
  userId!: string;
}
