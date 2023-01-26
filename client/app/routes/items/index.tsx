import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql, requestClient } from "~/gql/util/gql-request";

const ITEMS_QUERY = gql`
  query Items {
    items {
      id
      name
      description
      imageUrl
      seller {
        username
      }
      condition
      categories {
        title
      }
      slug
    }
  }
`;

export const loader: LoaderFunction = async () => {
  const response = await requestClient.request(ITEMS_QUERY);
  return json({ data: response });
};

export default function ItemsIndexRoute() {
  const {
    data: { items },
  } = useLoaderData();

  return <div>{JSON.stringify(items)}</div>;
}
