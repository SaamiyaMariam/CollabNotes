import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class RenameFolderInput {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}
