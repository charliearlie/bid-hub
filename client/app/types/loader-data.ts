import { Item } from "~/gql/graphql";

export type ItemsLoaderData = {
  items: Item[];
  success: boolean;
};
