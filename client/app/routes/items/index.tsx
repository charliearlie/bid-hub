import { gql, useQuery } from "@apollo/client";

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

export default function ItemsIndexRoute() {
  const { data, error, loading } = useQuery(ITEMS_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  return <div>{JSON.stringify(data)}</div>;
}
