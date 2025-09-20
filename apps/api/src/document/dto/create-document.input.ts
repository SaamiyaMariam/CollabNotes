import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateDocumentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;

}
