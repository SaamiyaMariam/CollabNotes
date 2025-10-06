import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql", // NestJS GraphQL endpoint
  documents: ["apps/web/src/**/*.{ts,tsx,gql}", "!apps/web/src/generated/**/*"],  // where FE gql queries live
  generates: {
    "apps/web/src/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ],
      config: {
        withHooks: true,  // auto-generate React hooks
      },
    },
  },
};

export default config;
