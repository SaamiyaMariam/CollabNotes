import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Document {
    @Field(() => ID)
    id!: string;

    @Field()
    title!: string;

    @Field({nullable: true})
    parentId?: string;

     @Field()
    ownerId!: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}