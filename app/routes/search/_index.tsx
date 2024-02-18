import { DataFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { StandardLayout } from "~/components/layout/standard-layout";
import { ListingPreview } from "~/components/listings";

import { getSearchListings } from "~/services/listings.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  let query = searchParams.get("query");
  invariant(query, "Query is required");

  const searchResults = await getSearchListings(query);

  const results = searchResults.map(
    ({ id, buyItNowPrice, description, slug, thumbnail, title }) => ({
      id,
      buyItNowPrice,
      description,
      slug,
      thumbnail,
      title,
    })
  );

  return json({ query, results } as const);
};

export default function SearchRoute() {
  const { query, results } = useLoaderData<typeof loader>();

  const headerText =
    results.length > 0 ? "Search results for:" : "No results found";
  return (
    <StandardLayout>
      <h1>
        {headerText} {query}
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {results.map((listing) => (
          <ListingPreview key={listing.slug} listing={listing} />
        ))}
      </div>
    </StandardLayout>
  );
}
