import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateFolderInput {
  @Field()
  @IsString()
  @Length(1, 100)
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;
}
