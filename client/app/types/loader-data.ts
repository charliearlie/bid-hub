import { Item, ItemResponse } from "~/gql/graphql";

export type ItemsLoaderData = {
  items: Item[];
  success: boolean;
};

export type ItemLoaderData = {
  items: ItemResponse;
  success: boolean;
};
