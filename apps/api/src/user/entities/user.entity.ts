import { ObjectType, Field, ID } from '@nestjs/graphql';
// import { Document } from '../../document/entities/document.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  displayName!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  // @Field(() => [Document], { nullable: true })
  // documents?: Document[];
}
