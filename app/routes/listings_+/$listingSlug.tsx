import { json, type DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { HeartIcon, Star } from "lucide-react";
import invariant from "tiny-invariant";

import {
  getCategoryAndParents,
  getListingBySlug,
} from "~/services/listings.server";

import { Button } from "~/components/common/ui/button";
import Card from "~/components/common/ui/card/card";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { CategoryBreadcrumbs } from "~/components/listings/category-breadcrumbs";
import { ImageGalleryTabs } from "~/components/listings/image-gallery-tabs";
import { ListingAdditionalDetailsSection } from "~/components/listings/listing-additional-details-section/listing-additional-details-section";

import { cn, invariantResponse } from "~/util/utils";

export const meta: MetaFunction<typeof loader, {}> = ({ data }) => {
  return [
    { title: `${data?.listing.title} | Website` },
    {
      name: "description",
      content: data?.listing.item.description, // Might add a description field to the listing
    },
  ];
};

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.listingSlug, "Expected params.listingSlug");
  const listing = await getListingBySlug(params.listingSlug);

  // todo: fix this type. Listings will only have one mandatory category
  const category = await getCategoryAndParents(
    listing?.categories[0].categoryId || ""
  );

  invariantResponse(listing, "Listing not found", {
    status: 404,
  });

  return json({ category, listing });
}

export default function ListingSlugRoute() {
  const { category, listing } = useLoaderData<typeof loader>();

  const { buyItNowPrice, title, images } = listing;

  return (
    <main className="container mx-auto max-w-screen-xl p-4">
      <Card>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
          <CategoryBreadcrumbs
            category={{
              id: category.id,
              name: category.name,
              slug: category.slug,
              parentCategory: category.parentCategory || undefined,
            }}
            listing={{
              slug: listing.slug,
              title: listing.title,
            }}
          />
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <ImageGalleryTabs images={images} listingTitle={title} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {title}
              </h1>
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl">£{buyItNowPrice}</p>
              </div>
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        className={cn(
                          4 > rating
                            ? "fill-primary text-primary"
                            : "fill-text-foreground text-foreground",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{5} out of 5 stars</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6 text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </div>
              </div>

              <form className="mt-6">
                <div className="sm:flex-col1 mt-10 flex items-center">
                  <Button type="submit">Add to bag</Button>

                  <button
                    type="button"
                    className="group ml-4 flex items-center justify-center rounded-md py-3 px-3 text-accent"
                  >
                    <HeartIcon
                      className="h-6 w-6 flex-shrink-0 text-foreground group-hover:fill-destructive group-hover:text-destructive dark:text-accent"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>
              </form>

              <ListingAdditionalDetailsSection />
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <ErrorBoundaryComponent
      statusHandlers={{
        404: ({ params }) => (
          <div className="p-4">
            <h2 className="text-3xl font-semibold">
              Listing with slug {params.listingSlug} not found
            </h2>
            <Link to="/">Go back home</Link>
          </div>
        ),
      }}
    />
  );
}
