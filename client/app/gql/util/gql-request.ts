import { redirect } from "@remix-run/node";
import { GraphQLClient } from "graphql-request";
import { getUserIdFromSession } from "~/session.server";
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

  if (!userId) {
    return redirect("/login");
  }

  return await requestClient.request(queryOrMutation, variables, {
    ...(cookieHeader && { Cookie: cookieHeader }),
  });
};
