import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, Length } from 'class-validator';

@InputType()
export class RenameNoteInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  id!: string;

  @Field()
  @IsString()
  @Length(1, 100)
  title!: string;
}
