import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import Items from "~/components/item/items/items";
import { Item } from "~/gql/graphql";
import { ITEMS_QUERY } from "~/gql/queries/items.query";
import { requestClient } from "~/gql/util/gql-request";

export const meta: MetaFunction = () => {
  return {
    title: "Latest items",
    description: "",
  };
};

export const loader: LoaderFunction = async () => {
  const response = await requestClient.request<Item[]>(ITEMS_QUERY);
  return json<Item[]>(response);
};

export default function ItemsIndexRoute() {
  return <Items />;
}
