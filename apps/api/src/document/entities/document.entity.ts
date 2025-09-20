import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class Document {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  ownerId!: string;

  @Field(() => User, { nullable: true })
  owner?: User;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => [Document], { nullable: true })
  children?: Document[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
