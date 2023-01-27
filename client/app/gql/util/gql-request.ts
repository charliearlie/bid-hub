import { GraphQLClient } from "graphql-request";
export * from "graphql-request";
export const requestClient = new GraphQLClient(
  "http://localhost:4000/graphql",
  {
    credentials: "include",
  }
);
