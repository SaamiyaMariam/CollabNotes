import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateNoteInput {
  @Field()
  title!: string;

  @Field(() => ID, { nullable: true })
  folderId?: string;
}
