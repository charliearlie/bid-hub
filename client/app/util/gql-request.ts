import { GraphQLClient } from "graphql-request";
import { getUserIdFromSession } from "~/session.server";
export * from "graphql-request";
export const requestClient = new GraphQLClient(
  "http://localhost:4000/graphql",
  {
    credentials: "include",
  }
);

export const requestWithCredentials = async (
  queryOrMutation: string,
  request: Request
) => {
  const cookieHeader = request.headers.get("Cookie");
  const userId = await getUserIdFromSession(request);

  if (!userId) {
    return "/login";
  }

  return await requestClient.request(queryOrMutation, undefined, {
    ...(cookieHeader && { Cookie: cookieHeader }),
  });
};
