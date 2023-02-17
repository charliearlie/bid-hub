import { useLoaderData, useTransition } from "@remix-run/react";
import { DataFunctionArgs, json, LoaderFunction } from "@remix-run/node";
import { requestClient } from "~/gql/util/gql-request.server";
import { ITEM_BY_ID_QUERY } from "~/gql/queries";

export const loader: LoaderFunction = async ({ params }: DataFunctionArgs) => {
  const response = await requestClient.request(ITEM_BY_ID_QUERY, {
    itemId: Number(params.itemId),
  });

  return json(response);
};

export default function ItemRoute() {
  const loaderData = useLoaderData();

  return <main>{JSON.stringify(loaderData)}</main>;
}
