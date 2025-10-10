import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Note } from './entities/note.entity';
import { NoteService } from './note.service';
import { CreateNoteInput } from './dto/create-note.input';
import { RenameNoteInput } from './dto/rename-note.input';
import { MoveNoteInput } from './dto/move-note.input';
import { ReorderNoteInput } from './dto/reorder-note.input';
import { SetNoteColorInput } from './dto/set-note-color.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Resolver(() => Note)
export class NoteResolver {
  constructor(private readonly noteService: NoteService) {}

  // ───────────────────────────────────────────────
  // Queries
  // ───────────────────────────────────────────────

  @UseGuards(GqlAuthGuard)  
  @Query(() => [Note], { description: 'Get notes in a folder (or loose notes if folderId is null)' })
  async notes(
    @CurrentUser() user: User,
    @Args('folderId', { type: () => String, nullable: true }) folderId?: string,
  ) {
    return this.noteService.findNotes(user.id, folderId);
  }

  @Query(() => Note, { description: 'Get a single note (must be creator or collaborator)' })
  async note(@CurrentUser() user: User, @Args('id') id: string) {
    return this.noteService.findOne(user.id, id);
  }

  @UseGuards(GqlAuthGuard) 
  @Query(() => Note, { nullable: true })
  async NoteByUrl(@Args('url') url: string, @CurrentUser() user: User) {
    return this.noteService.findByUrl(user.id, url);
  }

  // ───────────────────────────────────────────────
  // Mutations
  // ───────────────────────────────────────────────

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Note, { description: 'Create a new note and mark current user as CREATOR' })
  async createNote(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateNoteInput }) input: CreateNoteInput,
  ) {
    return this.noteService.createNote(user.id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Note, { description: 'Rename a note (CREATOR or EDITOR allowed)' })
  async renameNote(
    @CurrentUser() user: User,
    @Args('input') input: RenameNoteInput,
  ) {
    return this.noteService.renameNote(user.id, input);
  }

  @Mutation(() => Note, { description: 'Move a note between folders (CREATOR or EDITOR allowed)' })
  async moveNote(
    @CurrentUser() user: User,
    @Args('input') input: MoveNoteInput,
  ) {
    return this.noteService.moveNote(user.id, input.id, input.folderId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Note)
  async setNoteColor(
    @CurrentUser() user: User,
    @Args('id') id: string,
    @Args('color') color: string,
  ) {
    return this.noteService.setNoteColor(user.id, id, color);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Note, { description: 'Soft-delete a note (CREATOR only)' })
  async deleteNote(@CurrentUser() user: User, @Args('id') id: string) {
    return this.noteService.deleteNote(user.id, id);
  }

  @Mutation(() => [Note], { description: 'Reorder notes inside a folder or root (CREATOR or EDITOR allowed)' })
  async reorderNotes(
    @CurrentUser() user: User,
    @Args('folderId', { type: () => String, nullable: true }) folderId: string | null,
    @Args({ name: 'items', type: () => [ReorderNoteInput] }) items: ReorderNoteInput[],
  ) {
    return this.noteService.reorderNotes(user.id, folderId, items);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Note, { description: 'Update note content (CREATOR or EDITOR allowed)' })
  async updateNoteContent(
    @CurrentUser() user: User,
    @Args('id') id: string,
    @Args('contentText', { nullable: true }) contentText?: string,
    @Args('contentJson', { nullable: true }) contentJson?: string,
  ) {
    return this.noteService.updateNoteContent(user.id, id, contentText, contentJson);
  }

}
