import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql, request } from "graphql-request";

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

export const loader: LoaderFunction = async () => {
  const response = await request(
    "http://localhost:4000/graphql/",
    CATEGORY_QUERY
  );
  return json({ data: response });
};

export default function Index() {
  const {
    data: { categories },
  } = useLoaderData();

  return <div>{JSON.stringify(categories)}</div>;
}
