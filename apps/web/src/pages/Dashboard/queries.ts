import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      displayName
    }
  }
`;

export const FOLDERS_QUERY = gql`
  query Folders {
    findUserFolders {
      id
      name
      color
      notes {
        id
      }
    }
  }
`;

export const ROOT_NOTES_QUERY = gql`
  query Notes {
    findUserNotes {
      id
      title
      color
      folderId
    }
  }
`;

export const CREATE_FOLDER = gql`
  mutation CreateFolder($name: String!, $color: String) {
    createFolder(input: { name: $name, color: $color }) {
      id
      name
      color
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($title: String!) {
    createNote(input: { title: $title }) {
      id
      title
      color
    }
  }
`;
