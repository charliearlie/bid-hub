import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Previews } from "~/components/listings";
import { getAllListings } from "~/services/listings.server";

export const meta = () => {
  return [{ title: "Bidhub | Buy & sell things" }];
};

export const loader = async () => {
  const listings = await getAllListings();

  if (!listings) {
    throw new Response("listings failed to load", { status: 500 });
  }

  const listingPreviewData = listings.map((listing) => {
    const { buyItNowPrice, highestBidValue, id, images, slug, title } = listing;
    return { buyItNowPrice, highestBidValue, id, images, slug, title };
  });
  return json({ listings: listingPreviewData });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <main>
      <img
        className="h-48 w-full object-cover md:h-96 lg:h-[32rem]"
        src="https://res.cloudinary.com/bidhub/image/upload/v1678720975/bidhub/Valkyrie-AMR-Pro_08_169.jpg"
        alt="Aston Martin Valkyrie"
      />
      <div>
        <h2 className="flex h-16 w-full items-center justify-center rounded bg-accent text-center text-3xl font-black">
          Buy & sell things
        </h2>
        <div className="mx-auto max-w-screen-2xl py-4 px-2 lg:px-4">
          <Previews listings={loaderData.listings} />
        </div>
      </div>
    </main>
  );
}
