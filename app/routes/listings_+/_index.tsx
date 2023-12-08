import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getAllListings } from "~/services/listings.server";

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
  return (
    <div className="flex flex-col gap-2 p-4">
      <h2>Number of listings: {listings.length}</h2>
      {listings.map((listing) => (
        <div key={listing.id} className="flex gap-2">
          <div>
            <img
              className="h-20 w-20 rounded-lg"
              src={listing.thumbnail}
              alt={listing.title}
            />
          </div>
          <div>
            <h3>{listing.title}</h3>
            <p>£{listing.buyItNowPrice}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
