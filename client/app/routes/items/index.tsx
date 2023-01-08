import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql, request } from "graphql-request";

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
  const response = await request("http://localhost:4000/graphql/", ITEMS_QUERY);
  return json({ data: response });
};

export default function ItemsIndexRoute() {
  const {
    data: { items },
  } = useLoaderData();
  console.log(items);

  return <div>{JSON.stringify(items)}</div>;
}
