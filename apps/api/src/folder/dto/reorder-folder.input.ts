import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ReorderFolderInput {
  @Field(() => ID)
  id!: string;

  @Field()
  sortOrder!: number;
}
