import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Note } from 'src/note/entities/note.entity';

@ObjectType()
export class Folder {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  color?: string;

  @Field()
  sortOrder!: number;

  @Field({ nullable: true })
  url!: string;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [Note], { nullable: 'itemsAndList' })
  notes?: Note[];
}
