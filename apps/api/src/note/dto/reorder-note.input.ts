import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class ReorderNoteInput {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  sortOrder!: number;
}
