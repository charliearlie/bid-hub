import { DataFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getSearchListings } from "~/services/listings.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  let { searchParams } = new URL(request.url);
  let query = searchParams.get("query");
  invariant(query, "Query is required");

  const searchResults = await getSearchListings(query);

  return json(
    searchResults.map(({ slug, thumbnail, title }) => ({
      slug,
      thumbnail,
      title,
    }))
  );
};
