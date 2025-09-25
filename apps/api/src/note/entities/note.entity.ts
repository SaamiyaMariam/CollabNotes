import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Folder } from 'src/folder/entities/folder.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Note {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  contentJson?: any; // TipTap JSON (GraphQL scalar `JSON` if added)

  @Field({ nullable: true })
  contentText?: string;

  @Field({ nullable: true })
  color?: string;

  @Field()
  sortOrder!: number;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => User)
  owner!: User;

  @Field(() => Folder, { nullable: true })
  folder?: Folder;
}
