import { gql, useQuery } from "@apollo/client";

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

export default function Index() {
  const { data } = useQuery(CATEGORY_QUERY);

  return <div>{JSON.stringify(data)}</div>;
}
