import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AddCollaboratorInput = {
  noteId: Scalars['String']['input'];
  role?: CollaboratorRole;
  userEmail: Scalars['String']['input'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export enum CollaboratorRole {
  Creator = 'CREATOR',
  Editor = 'EDITOR'
}

export type CreateFolderInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNoteInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  folderId?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type Folder = {
  __typename?: 'Folder';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Array<Maybe<Note>>>;
  sortOrder: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MoveNoteInput = {
  folderId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCollaborator: NoteCollaborator;
  createFolder: Folder;
  /** Create a new note and mark current user as CREATOR */
  createNote: Note;
  deleteFolder: Folder;
  /** Soft-delete a note (CREATOR only) */
  deleteNote: Note;
  login: AuthResponse;
  /** Move a note between folders (CREATOR or EDITOR allowed) */
  moveNote: Note;
  removeCollaborator: Scalars['Boolean']['output'];
  renameFolder: Folder;
  /** Rename a note (CREATOR or EDITOR allowed) */
  renameNote: Note;
  reorderFolders: Array<Folder>;
  /** Reorder notes inside a folder or root (CREATOR or EDITOR allowed) */
  reorderNotes: Array<Note>;
  resetPassword: User;
  setFolderColor: Folder;
  setNoteColor: Note;
  signup: AuthResponse;
};


export type MutationAddCollaboratorArgs = {
  input: AddCollaboratorInput;
};


export type MutationCreateFolderArgs = {
  input: CreateFolderInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationDeleteFolderArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationMoveNoteArgs = {
  input: MoveNoteInput;
};


export type MutationRemoveCollaboratorArgs = {
  input: RemoveCollaboratorInput;
};


export type MutationRenameFolderArgs = {
  input: RenameFolderInput;
};


export type MutationRenameNoteArgs = {
  input: RenameNoteInput;
};


export type MutationReorderFoldersArgs = {
  items: Array<ReorderFolderInput>;
};


export type MutationReorderNotesArgs = {
  folderId?: InputMaybe<Scalars['String']['input']>;
  items: Array<ReorderNoteInput>;
};


export type MutationResetPasswordArgs = {
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationSetFolderColorArgs = {
  color: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationSetNoteColorArgs = {
  color: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  data: SignupInput;
};

export type Note = {
  __typename?: 'Note';
  collaborators?: Maybe<Array<NoteCollaborator>>;
  color?: Maybe<Scalars['String']['output']>;
  contentJson?: Maybe<Scalars['String']['output']>;
  contentText?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  folder?: Maybe<Folder>;
  folderId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  sortOrder: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type NoteCollaborator = {
  __typename?: 'NoteCollaborator';
  addedBy: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  note: Note;
  noteId: Scalars['ID']['output'];
  role: CollaboratorRole;
  user: User;
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  NoteByUrl?: Maybe<Note>;
  folderByUrl?: Maybe<Folder>;
  folders: Array<Folder>;
  listCollaborators: Array<NoteCollaborator>;
  me?: Maybe<User>;
  /** Get a single note (must be creator or collaborator) */
  note: Note;
  /** Get notes in a folder (or loose notes if folderId is null) */
  notes: Array<Note>;
};


export type QueryNoteByUrlArgs = {
  url: Scalars['String']['input'];
};


export type QueryFolderByUrlArgs = {
  url: Scalars['String']['input'];
};


export type QueryFoldersArgs = {
  rootOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryListCollaboratorsArgs = {
  noteId: Scalars['String']['input'];
};


export type QueryNoteArgs = {
  id: Scalars['String']['input'];
};


export type QueryNotesArgs = {
  folderId?: InputMaybe<Scalars['String']['input']>;
};

export type RemoveCollaboratorInput = {
  noteId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type RenameFolderInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type RenameNoteInput = {
  id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type ReorderFolderInput = {
  id: Scalars['ID']['input'];
  sortOrder: Scalars['Float']['input'];
};

export type ReorderNoteInput = {
  id: Scalars['ID']['input'];
  sortOrder: Scalars['Int']['input'];
};

export type SignupInput = {
  displayName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateFolderMutationVariables = Exact<{
  input: CreateFolderInput;
}>;


export type CreateFolderMutation = { __typename?: 'Mutation', createFolder: { __typename?: 'Folder', id: string, name: string, color?: string | null, createdAt: any } };

export type DeleteFolderMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteFolderMutation = { __typename?: 'Mutation', deleteFolder: { __typename?: 'Folder', id: string } };

export type DeleteNoteMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteNoteMutation = { __typename?: 'Mutation', deleteNote: { __typename?: 'Note', id: string } };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'Note', id: string, title: string, color?: string | null, folderId?: string | null, createdAt: any } };

export type GetFoldersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFoldersQuery = { __typename?: 'Query', folders: Array<{ __typename?: 'Folder', id: string, name: string, url?: string | null, color?: string | null, sortOrder: number, createdAt: any, updatedAt: any, notes?: Array<{ __typename?: 'Note', id: string, title: string, url?: string | null, color?: string | null } | null> | null }> };

export type GetNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotesQuery = { __typename?: 'Query', notes: Array<{ __typename?: 'Note', id: string, title: string, url?: string | null, color?: string | null, folderId?: string | null, createdAt: any, updatedAt: any }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, displayName: string, email: string } | null };

export type SetFolderColorMutationVariables = Exact<{
  id: Scalars['String']['input'];
  color: Scalars['String']['input'];
}>;


export type SetFolderColorMutation = { __typename?: 'Mutation', setFolderColor: { __typename?: 'Folder', id: string, name: string, color?: string | null } };

export type SetNoteColorMutationVariables = Exact<{
  id: Scalars['String']['input'];
  color: Scalars['String']['input'];
}>;


export type SetNoteColorMutation = { __typename?: 'Mutation', setNoteColor: { __typename?: 'Note', id: string, color?: string | null } };

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string } };

export type SignupMutationVariables = Exact<{
  data: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string } };


export const CreateFolderDocument = gql`
    mutation CreateFolder($input: CreateFolderInput!) {
  createFolder(input: $input) {
    id
    name
    color
    createdAt
  }
}
    `;
export type CreateFolderMutationFn = Apollo.MutationFunction<CreateFolderMutation, CreateFolderMutationVariables>;

/**
 * __useCreateFolderMutation__
 *
 * To run a mutation, you first call `useCreateFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFolderMutation, { data, loading, error }] = useCreateFolderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFolderMutation(baseOptions?: Apollo.MutationHookOptions<CreateFolderMutation, CreateFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFolderMutation, CreateFolderMutationVariables>(CreateFolderDocument, options);
      }
export type CreateFolderMutationHookResult = ReturnType<typeof useCreateFolderMutation>;
export type CreateFolderMutationResult = Apollo.MutationResult<CreateFolderMutation>;
export type CreateFolderMutationOptions = Apollo.BaseMutationOptions<CreateFolderMutation, CreateFolderMutationVariables>;
export const DeleteFolderDocument = gql`
    mutation DeleteFolder($id: String!) {
  deleteFolder(id: $id) {
    id
  }
}
    `;
export type DeleteFolderMutationFn = Apollo.MutationFunction<DeleteFolderMutation, DeleteFolderMutationVariables>;

/**
 * __useDeleteFolderMutation__
 *
 * To run a mutation, you first call `useDeleteFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFolderMutation, { data, loading, error }] = useDeleteFolderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFolderMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFolderMutation, DeleteFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFolderMutation, DeleteFolderMutationVariables>(DeleteFolderDocument, options);
      }
export type DeleteFolderMutationHookResult = ReturnType<typeof useDeleteFolderMutation>;
export type DeleteFolderMutationResult = Apollo.MutationResult<DeleteFolderMutation>;
export type DeleteFolderMutationOptions = Apollo.BaseMutationOptions<DeleteFolderMutation, DeleteFolderMutationVariables>;
export const DeleteNoteDocument = gql`
    mutation DeleteNote($id: String!) {
  deleteNote(id: $id) {
    id
  }
}
    `;
export type DeleteNoteMutationFn = Apollo.MutationFunction<DeleteNoteMutation, DeleteNoteMutationVariables>;

/**
 * __useDeleteNoteMutation__
 *
 * To run a mutation, you first call `useDeleteNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNoteMutation, { data, loading, error }] = useDeleteNoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteNoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNoteMutation, DeleteNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument, options);
      }
export type DeleteNoteMutationHookResult = ReturnType<typeof useDeleteNoteMutation>;
export type DeleteNoteMutationResult = Apollo.MutationResult<DeleteNoteMutation>;
export type DeleteNoteMutationOptions = Apollo.BaseMutationOptions<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const CreateNoteDocument = gql`
    mutation CreateNote($input: CreateNoteInput!) {
  createNote(input: $input) {
    id
    title
    color
    folderId
    createdAt
  }
}
    `;
export type CreateNoteMutationFn = Apollo.MutationFunction<CreateNoteMutation, CreateNoteMutationVariables>;

/**
 * __useCreateNoteMutation__
 *
 * To run a mutation, you first call `useCreateNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNoteMutation, { data, loading, error }] = useCreateNoteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateNoteMutation, CreateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument, options);
      }
export type CreateNoteMutationHookResult = ReturnType<typeof useCreateNoteMutation>;
export type CreateNoteMutationResult = Apollo.MutationResult<CreateNoteMutation>;
export type CreateNoteMutationOptions = Apollo.BaseMutationOptions<CreateNoteMutation, CreateNoteMutationVariables>;
export const GetFoldersDocument = gql`
    query GetFolders {
  folders {
    id
    name
    url
    color
    sortOrder
    createdAt
    updatedAt
    notes {
      id
      title
      url
      color
    }
  }
}
    `;

/**
 * __useGetFoldersQuery__
 *
 * To run a query within a React component, call `useGetFoldersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFoldersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFoldersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFoldersQuery(baseOptions?: Apollo.QueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
      }
export function useGetFoldersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
        }
export function useGetFoldersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
        }
export type GetFoldersQueryHookResult = ReturnType<typeof useGetFoldersQuery>;
export type GetFoldersLazyQueryHookResult = ReturnType<typeof useGetFoldersLazyQuery>;
export type GetFoldersSuspenseQueryHookResult = ReturnType<typeof useGetFoldersSuspenseQuery>;
export type GetFoldersQueryResult = Apollo.QueryResult<GetFoldersQuery, GetFoldersQueryVariables>;
export const GetNotesDocument = gql`
    query GetNotes {
  notes {
    id
    title
    url
    color
    folderId
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetNotesQuery__
 *
 * To run a query within a React component, call `useGetNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNotesQuery(baseOptions?: Apollo.QueryHookOptions<GetNotesQuery, GetNotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
      }
export function useGetNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotesQuery, GetNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
        }
export function useGetNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotesQuery, GetNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
        }
export type GetNotesQueryHookResult = ReturnType<typeof useGetNotesQuery>;
export type GetNotesLazyQueryHookResult = ReturnType<typeof useGetNotesLazyQuery>;
export type GetNotesSuspenseQueryHookResult = ReturnType<typeof useGetNotesSuspenseQuery>;
export type GetNotesQueryResult = Apollo.QueryResult<GetNotesQuery, GetNotesQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    displayName
    email
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const SetFolderColorDocument = gql`
    mutation SetFolderColor($id: String!, $color: String!) {
  setFolderColor(id: $id, color: $color) {
    id
    name
    color
  }
}
    `;
export type SetFolderColorMutationFn = Apollo.MutationFunction<SetFolderColorMutation, SetFolderColorMutationVariables>;

/**
 * __useSetFolderColorMutation__
 *
 * To run a mutation, you first call `useSetFolderColorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetFolderColorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setFolderColorMutation, { data, loading, error }] = useSetFolderColorMutation({
 *   variables: {
 *      id: // value for 'id'
 *      color: // value for 'color'
 *   },
 * });
 */
export function useSetFolderColorMutation(baseOptions?: Apollo.MutationHookOptions<SetFolderColorMutation, SetFolderColorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetFolderColorMutation, SetFolderColorMutationVariables>(SetFolderColorDocument, options);
      }
export type SetFolderColorMutationHookResult = ReturnType<typeof useSetFolderColorMutation>;
export type SetFolderColorMutationResult = Apollo.MutationResult<SetFolderColorMutation>;
export type SetFolderColorMutationOptions = Apollo.BaseMutationOptions<SetFolderColorMutation, SetFolderColorMutationVariables>;
export const SetNoteColorDocument = gql`
    mutation SetNoteColor($id: String!, $color: String!) {
  setNoteColor(id: $id, color: $color) {
    id
    color
  }
}
    `;
export type SetNoteColorMutationFn = Apollo.MutationFunction<SetNoteColorMutation, SetNoteColorMutationVariables>;

/**
 * __useSetNoteColorMutation__
 *
 * To run a mutation, you first call `useSetNoteColorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetNoteColorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setNoteColorMutation, { data, loading, error }] = useSetNoteColorMutation({
 *   variables: {
 *      id: // value for 'id'
 *      color: // value for 'color'
 *   },
 * });
 */
export function useSetNoteColorMutation(baseOptions?: Apollo.MutationHookOptions<SetNoteColorMutation, SetNoteColorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetNoteColorMutation, SetNoteColorMutationVariables>(SetNoteColorDocument, options);
      }
export type SetNoteColorMutationHookResult = ReturnType<typeof useSetNoteColorMutation>;
export type SetNoteColorMutationResult = Apollo.MutationResult<SetNoteColorMutation>;
export type SetNoteColorMutationOptions = Apollo.BaseMutationOptions<SetNoteColorMutation, SetNoteColorMutationVariables>;
export const LoginDocument = gql`
    mutation Login($data: LoginInput!) {
  login(data: $data) {
    accessToken
    refreshToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const SignupDocument = gql`
    mutation Signup($data: SignupInput!) {
  signup(data: $data) {
    accessToken
    refreshToken
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;