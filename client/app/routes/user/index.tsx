import { json } from "@remix-run/node";
import { gql, useQuery } from "@apollo/client";
import { useLoaderData } from "@remix-run/react";

const ME_QUERY = gql`
  query Me {
    me {
      user {
        username
        id
        addresses {
          addressName
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export async function loader({ request }: any) {
  // Surely must be a way to do this without using this same code in every loader?
  const cookieHeader = request.headers.get("Cookie");
  return json({ cookieHeader });
}

export default function UserRoute(req: Request) {
  const { cookieHeader } = useLoaderData();
  const { data, error, loading } = useQuery(ME_QUERY, {
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
  });

  if (error) return <p>{JSON.stringify(error)}</p>;

  if (loading) return <p>Loading...</p>;
  return <div>{JSON.stringify(data)}</div>;
}
