import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { Document } from '../document/entities/document.entity';
import { CreateDocumentInput } from './dto/create-document.input';

@Resolver(() => Document)
export class DocumentResolver {
    constructor(private readonly documentService: DocumentService) {}

    // mutation to create document
    @Mutation(() => Document)
    createDocument(
        @Args('data') createDocumentInput: CreateDocumentInput,
        @Context() context: any, // contains request + user info
    ) {
        const userId = context.req.user.sub; // JWT payload -> sub
        return this.documentService.createDocument(userId, createDocumentInput);
    }
    
    // query to fetch all documents
    @Query(() => [Document], { name: 'documents' })
    async fetchAllDocuments(@Context() context: any) {
        const userId = context.req.user.sub;
        return this.documentService.fetchAllDocs(userId);
    }

    // query to fetch a specific document
    @Query(() => Document, { name: 'document' })
    findOne(@Args('id') id: string, @Context() context: any) {
        const userId = context.req.user.sub;
        return this.documentService.findOne(userId, id);
    }
}