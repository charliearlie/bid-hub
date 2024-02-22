import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Previews } from "~/components/listings";

import { getHomepageCategories } from "~/services/category.server";
import { getAllListings } from "~/services/listings.server";

export const meta = () => {
  return [{ title: "Bidhub | Buy & sell things" }];
};

export const loader = async () => {
  const listings = await getAllListings({ amount: 10 });
  const categories = await getHomepageCategories();

  if (!listings) {
    throw new Response("listings failed to load", { status: 500 });
  }

  const listingPreviewData = listings.map((listing) => {
    const {
      buyItNowPrice,
      description,
      id,
      images,
      slug,
      startingBid,
      thumbnail,
      title,
    } = listing;
    return {
      buyItNowPrice,
      description,
      id,
      images,
      slug,
      startingBid,
      thumbnail,
      title,
    };
  });
  return json({ listings: listingPreviewData, categories });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <main className="bg-background">
      <div>
        <h2 className="flex h-16 w-full items-center justify-center rounded bg-accent text-center text-3xl font-black">
          Buy & sell things
        </h2>
        <div className="mx-auto max-w-screen-xl px-2 py-4 lg:px-4">
          <h2>Recent listings</h2>
          <Previews listings={loaderData.listings} />
        </div>
        <div className="bg-accent">
          <div className="mx-auto max-w-screen-xl px-2 py-4 lg:px-4">
            <h2>Popular Categories</h2>
            <ul
              className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4"
              id="popular-category-list"
            >
              {loaderData.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    className="flex cursor-pointer flex-col gap-2 hover:opacity-80"
                    to={`/category/${category.slug}`}
                  >
                    <img
                      className="rounded-md"
                      src={category.image || ""}
                      alt={category.name}
                    />
                    <p className="text-center">{category.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
