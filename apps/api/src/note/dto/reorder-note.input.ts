import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ReorderNoteInput {
  @Field(() => ID)
  id!: string;

  @Field()
  sortOrder!: number;
}
