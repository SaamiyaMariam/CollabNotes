import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql", // NestJS GraphQL endpoint
  documents: [
  "apps/web/src/**/*.{ts,tsx,gql,graphql}",
  "apps/web/**/*.gql",
  "apps/web/**/*.graphql",
  "!apps/web/src/generated/**/*"
],
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
