import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateNoteInput {
  @Field()
  @IsString()
  @Length(1, 100)
  title!: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  folderId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;
}
