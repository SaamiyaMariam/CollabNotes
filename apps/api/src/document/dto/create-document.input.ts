import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDocumentInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  parentId?: string;
}
