import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';
import { Prisma } from '@prisma/client';

@InputType()
export class UpdateNoteContentInput {
  @Field(() => ID)
  @IsString()
  id!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contentText?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  contentJson?: Prisma.InputJsonValue;
}