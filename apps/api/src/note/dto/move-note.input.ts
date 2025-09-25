import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class MoveNoteInput {
  @Field(() => ID)
  id!: string;

  @Field(() => ID, { nullable: true })
  folderId?: string; // null = move to root
}
