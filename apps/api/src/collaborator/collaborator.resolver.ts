import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NoteCollaborator } from './entities/collaborator.entity';
import { CollaboratorService } from './collaborator.service';
import { AddCollaboratorInput } from './dto/add-collaborator.input';
import { RemoveCollaboratorInput } from './dto/remove-collaborator.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Resolver(() => NoteCollaborator)
export class CollaboratorResolver {
  constructor(private collaboratorService: CollaboratorService) {}

  @Query(() => [NoteCollaborator])
  async listCollaborators(
    @CurrentUser() user: User,
    @Args('noteId') noteId: string,
  ) {
    return this.collaboratorService.listCollaborators(user.id, noteId);
  }

  @Mutation(() => NoteCollaborator)
  async addCollaborator(
    @CurrentUser() user: User,
    @Args('input') input: AddCollaboratorInput,
  ) {
    return this.collaboratorService.addCollaborator(user.id, input);
  }

  @Mutation(() => Boolean)
  async removeCollaborator(
    @CurrentUser() user: User,
    @Args('input') input: RemoveCollaboratorInput,
  ) {
    await this.collaboratorService.removeCollaborator(user.id, input);
    return true;
  }
}
