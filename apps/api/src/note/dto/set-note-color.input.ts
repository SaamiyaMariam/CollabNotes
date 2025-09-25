import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class SetNoteColorInput {
  @Field(() => ID)
  id!: string;

  @Field()
  color!: string;
}
