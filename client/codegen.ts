import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.BACKEND_ENDPOINT,
  documents: ["app/**/*.tsx"],
  generates: {
    "./app/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};
export default config;
