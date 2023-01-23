import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { ME_QUERY } from "~/gql/queries/me";
import { requestClient } from "~/util/gql-request";

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
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
