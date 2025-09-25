import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class RenameNoteInput {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;
}
