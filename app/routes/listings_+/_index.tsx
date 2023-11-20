import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getAllListings } from "~/services/listings.server";

import Previews from "~/components/listings/listing-preview/previews";

export const meta = () => {
  return [{ title: "Latest listings" }, { name: "description", content: "" }];
};

export const loader = async () => {
  const listings = await getAllListings();

  if (!listings) {
    throw new Response("Listings failed to load", { status: 500 });
  }

  const listingPreviewData = listings.map((listing) => {
    const {
      buyItNowPrice,
      highestBidValue,
      id,
      images,
      slug,
      thumbnail,
      title,
    } = listing;
    return {
      buyItNowPrice,
      highestBidValue,
      id,
      images,
      slug,
      thumbnail,
      title,
    };
  });
  return json({ listings: listingPreviewData });
};

export default function ItemsIndexRoute() {
  const { listings } = useLoaderData<typeof loader>();
  return <Previews listings={listings} />;
}
