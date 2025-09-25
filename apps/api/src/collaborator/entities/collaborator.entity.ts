import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Note } from '../../note/entities/note.entity';
import { CollaboratorRole } from '../dto/collaborator-role.enum';

@ObjectType()
export class NoteCollaborator {
  @Field(() => ID)
  noteId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => CollaboratorRole)
  role!: CollaboratorRole;

  @Field()
  addedBy!: string;

  @Field()
  createdAt!: Date;

  @Field(() => Note)
  note!: Note;

  @Field(() => User)
  user!: User;
}
