import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Note } from './entities/note.entity';
import { NoteService } from './note.service';
import { CreateNoteInput } from './dto/create-note.input';
import { RenameNoteInput } from './dto/rename-note.input';
import { MoveNoteInput } from './dto/move-note.input';
import { ReorderNoteInput } from './dto/reorder-note.input';
import { SetNoteColorInput } from './dto/set-note-color.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Note)
export class NoteResolver {
  constructor(private noteService: NoteService) {}

  @Query(() => [Note])
  async notes(
    @CurrentUser() user: User,
    @Args('folderId', { type: () => String, nullable: true }) folderId?: string,
  ) {
    return this.noteService.findNotes(user.id, folderId);
  }

  @Query(() => Note)
  async note(@CurrentUser() user: User, @Args('id') id: string) {
    return this.noteService.findOne(user.id, id);
  }

  @Mutation(() => Note)
  async createNote(
    @CurrentUser() user: User,
    @Args('input') input: CreateNoteInput,
  ) {
    return this.noteService.createNote(user.id, input);
  }

  @Mutation(() => Note)
  async renameNote(
    @CurrentUser() user: User,
    @Args('input') input: RenameNoteInput,
  ) {
    return this.noteService.renameNote(user.id, input.id, input.title);
  }

  @Mutation(() => Note)
  async moveNote(
    @CurrentUser() user: User,
    @Args('input') input: MoveNoteInput,
  ) {
    return this.noteService.moveNote(user.id, input.id, input.folderId);
  }

  @Mutation(() => Note)
  async setNoteColor(
    @CurrentUser() user: User,
    @Args('input') input: SetNoteColorInput,
  ) {
    return this.noteService.setNoteColor(user.id, input.id, input.color);
  }

  @Mutation(() => Note)
  async deleteNote(@CurrentUser() user: User, @Args('id') id: string) {
    return this.noteService.deleteNote(user.id, id);
  }

  @Mutation(() => [Note])
  async reorderNotes(
    @CurrentUser() user: User,
    @Args('folderId', { type: () => String, nullable: true }) folderId: string | null,
    @Args({ name: 'items', type: () => [ReorderNoteInput] }) items: ReorderNoteInput[],
  ) {
    return this.noteService.reorderNotes(user.id, folderId, items);
  }
}
