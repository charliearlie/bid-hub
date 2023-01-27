import { redirect } from "@remix-run/node";
import { GraphQLClient } from "graphql-request";
import { getSession, getUserIdFromSession } from "~/session.server";
export * from "graphql-request";
export const requestClient = new GraphQLClient(process.env.BACKEND_ENDPOINT, {
  credentials: "include",
});

export const requestWithCredentials = async (
  queryOrMutation: string,
  request: Request,
  variables?: unknown
) => {
  const cookieHeader = request.headers.get("Cookie");
  const userId = await getUserIdFromSession(request);
  const session = await getSession(request);

  if (!userId) {
    return redirect("/login");
  }
  const jwt = session.get("jwt");

  return await requestClient.request(queryOrMutation, variables, {
    ...(cookieHeader && { Cookie: `jwt=${jwt}` }),
  });
};
