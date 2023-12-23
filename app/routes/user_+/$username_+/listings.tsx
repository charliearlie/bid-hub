import { DataFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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
    })),
  } as const);
};

export default function UserListings() {
  const { listings } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-2">
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
