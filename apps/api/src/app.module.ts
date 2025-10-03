import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FolderModule } from './folder/folder.module';
import { NoteModule } from './note/note.module';
import { CollaboratorModule } from './collaborator/collaborator.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      // IMPORTANT: disable GraphQL’s internal body parser
      bodyParserConfig: false,
      context: ({ req, res }) => ({ req, res }),
    }),
    UserModule,
    FolderModule,
    NoteModule,
    CollaboratorModule,
  ],
})
export class AppModule {}
