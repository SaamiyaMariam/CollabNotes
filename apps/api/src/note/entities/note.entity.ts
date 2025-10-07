import { ObjectType, Field, ID } from '@nestjs/graphql';
import { NoteCollaborator } from '../../collaborator/entities/collaborator.entity';
import { Folder } from '../../folder/entities/folder.entity';

@ObjectType()
export class Note {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;
  
  @Field({ nullable: true })
  contentJson?: string;

  @Field({ nullable: true })
  contentText?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => Number)
  sortOrder!: number;

  @Field({ nullable: true })
  url!: string;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  // Relations
  @Field(() => Folder, { nullable: true })
  folder?: Folder;

  @Field(() => String, { nullable: true })
  folderId?: string;

  @Field(() => [NoteCollaborator], { nullable: true })
  collaborators?: NoteCollaborator[];
}
