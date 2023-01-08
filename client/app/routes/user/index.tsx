import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql, request as gqlRequest } from "graphql-request";
import { requestClient } from "~/util/gql-request";

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
  const response = await requestClient.request(ME_QUERY, undefined, {
    Cookie: cookieHeader,
  });
  return json({ data: response });
}

export default function UserRoute(req: Request) {
  const {
    data: { me },
  } = useLoaderData();
  return <div>{JSON.stringify(me)}</div>;
}
