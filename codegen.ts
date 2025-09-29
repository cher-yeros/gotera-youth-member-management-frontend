import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: "src/**/*.{ts,tsx}",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        withHooks: false,
        withComponent: false,
        withHOC: false,
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
