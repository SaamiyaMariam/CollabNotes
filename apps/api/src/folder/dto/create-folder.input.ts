import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFolderInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  color?: string;
}
