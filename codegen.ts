import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema:
    process.env.GRAPHQL_SCHEMA ||
    "../gotera-youth-member-management-backend/src/generated/schema.graphql",
  documents: "src/**/*.{ts,tsx}",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        withHooks: false,
        withComponent: false,
        withHOC: false,
        enumsAsTypes: true,
        scalars: {
          DateTime: "string",
          Date: "string",
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
