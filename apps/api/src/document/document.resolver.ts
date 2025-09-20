import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from '../document/entities/document.entity';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => Document)
export class DocumentResolver {
    constructor(private readonly documentService: DocumentService) {}

    // mutation to create document
    @UseGuards(GqlAuthGuard)
    @Mutation(() => Document)
    createDocument(
    @Args('data') data: CreateDocumentInput,
    @CurrentUser() user: any,
    ) {
    console.log('resolver received:', data);
    return this.documentService.createDocument(user.userId, data);
    }

    // query to fetch all documents
    @UseGuards(GqlAuthGuard)
    @Query(() => [Document], { name: 'documents' })
    async fetchAllDocuments(@CurrentUser() user: any) {
        return this.documentService.fetchAllDocs(user.userId);
    }

    // query to fetch a specific document
    @UseGuards(GqlAuthGuard)
    @Query(() => Document, { name: 'document' })
    findOne(@Args('id') id: string, @CurrentUser() user: any) {
        return this.documentService.findOne(user.userId, id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Document)
    updateDocument(
    @Args('data', { type: () => UpdateDocumentInput })
    updateDocumentInput: UpdateDocumentInput,
    @CurrentUser() user: any,
    ) {
    return this.documentService.updateDocument(user.userId, updateDocumentInput);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Document)
    deleteDocument(
    @Args('id') id: string,
    @CurrentUser() user: any,
    ) {
    return this.documentService.deleteDocument(user.userId, id);
    }

}