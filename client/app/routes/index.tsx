import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql, requestClient } from "~/gql/util/gql-request";

const CATEGORY_QUERY = gql`
  query Categories {
    categories {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

export const loader: LoaderFunction = async ({ request }) => {
  const response = await requestClient.request(CATEGORY_QUERY, undefined, {
    Cookie: request.headers.get("Cookie") || "",
  });
  return json({ data: response });
};

export default function Index() {
  const {
    data: { categories },
  } = useLoaderData();

  return <div>{JSON.stringify(categories)}</div>;
}
