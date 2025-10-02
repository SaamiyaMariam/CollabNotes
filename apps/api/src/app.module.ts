import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { PrismaModule } from 'prisma/prisma.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { IncomingMessage } from 'http';
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
      context: ({ req }: { req: IncomingMessage }) => ({ req }),
    }),
    UserModule,
    FolderModule,
    NoteModule,
    CollaboratorModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
