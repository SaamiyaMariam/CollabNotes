import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Folder } from './entities/folder.entity';
import { FolderService } from './folder.service';
import { CreateFolderInput } from './dto/create-folder.input';
import { RenameFolderInput } from './dto/rename-folder.input';
import { ReorderFolderInput } from './dto/reorder-folder.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Resolver(() => Folder)
export class FolderResolver {
  constructor(private folderService: FolderService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Folder])
  async folders(
    @CurrentUser() user: User,
    @Args('rootOnly', { nullable: true }) rootOnly?: boolean,
  ) {
    return this.folderService.findUserFolders(user.id, rootOnly);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Folder)
  async createFolder(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateFolderInput }) input: CreateFolderInput,
    
  ) {
console.log("RAW input:", JSON.stringify(input, null, 2));
  console.log("Keys:", Object.keys(input));
    return this.folderService.createFolder(user.id, input);
  }

  @Mutation(() => Folder)
  async renameFolder(
    @CurrentUser() user: User,
    @Args('input') input: RenameFolderInput,
  ) {
    return this.folderService.renameFolder(user.id, input.id, input.name);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Folder)
  async setFolderColor(
    @CurrentUser() user: User,
    @Args('id') id: string,
    @Args('color') color: string,
  ) {
    return this.folderService.setFolderColor(user.id, id, color);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Folder)
  async deleteFolder(@CurrentUser() user: User, @Args('id') id: string) {
    return this.folderService.deleteFolder(user.id, id);
  }

  @Mutation(() => [Folder])
  async reorderFolders(
    @CurrentUser() user: User,
    @Args({ name: 'items', type: () => [ReorderFolderInput] })
    items: ReorderFolderInput[],
  ) {
    return this.folderService.reorderFolders(user.id, items);
  }
}
