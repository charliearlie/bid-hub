import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import Items from "~/components/item/items";
import { ITEMS_QUERY } from "~/gql/queries/items.query";
import { requestClient } from "~/gql/util/gql-request";
import { ItemsLoaderData } from "~/types/loader-data";

export const meta: MetaFunction = () => {
  return {
    title: "Latest items",
    description: "",
  };
};

export const loader: LoaderFunction = async () => {
  const response = await requestClient.request<ItemsLoaderData>(ITEMS_QUERY);
  return json<ItemsLoaderData>({ items: response.items, success: true });
};

export default function ItemsIndexRoute() {
  return <Items />;
}
