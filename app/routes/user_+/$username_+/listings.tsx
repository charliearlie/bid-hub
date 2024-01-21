import { DataFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import ListingPreviewCondensed from "~/components/listings/listing-preview/listing-preview-condensed";

import { getUsersListings } from "~/services/listings.server";

import { invariantResponse } from "~/util/utils";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  invariantResponse(params.username, "No username provided");

  const listings = await getUsersListings(params.username);
  if (!listings.length) {
    throw new Response("User not found", { status: 404 });
  }

  return json({
    listings: listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      slug: listing.slug,
      buyItNowPrice: listing.buyItNowPrice,
      thumbnail: listing.thumbnail,
      description: listing.description,
    })),
  } as const);
};

export default function UserListings() {
  const { listings } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-2">
      {listings.map((listing) => (
        <ListingPreviewCondensed listing={listing} key={listing.slug} />
      ))}
    </div>
  );
}
