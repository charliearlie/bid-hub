import { GraphQLClient } from "graphql-request";
export * from "graphql-request";
export const requestClient = new GraphQLClient(process.env.BACKEND_ENDPOINT, {
  credentials: "include",
});
