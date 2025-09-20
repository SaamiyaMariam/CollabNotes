import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateDocumentInput } from './create-document.input';

@InputType()
export class UpdateDocumentInput extends PartialType(CreateDocumentInput) {
  @Field(() => ID)
  id!: string;
}
