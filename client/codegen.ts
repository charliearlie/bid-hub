import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: ["app/**/*.tsx"],
  generates: {
    "./app/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};
export default config;
