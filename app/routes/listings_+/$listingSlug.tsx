import { json, type DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { HeartIcon } from "lucide-react";
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
import { SellerDetails } from "~/components/listings/seller-details";

import { invariantResponse } from "~/util/utils";

export const meta: MetaFunction<typeof loader, {}> = ({ data }) => {
  return [
    { title: `${data?.listing.title} | Bidhub` },
    {
      name: "description",
      content: data?.listing.description,
    },
    {
      property: "og:image",
      content: data?.listing.thumbnail,
    },
  ];
};

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.listingSlug, "Expected params.listingSlug");
  const listing = await getListingBySlug(params.listingSlug);

  invariantResponse(listing, "Listing not found", {
    status: 404,
  });

  const category = await getCategoryAndParents(listing.categoryId);

  return json({ category, listing });
}

export default function ListingSlugRoute() {
  const { category, listing } = useLoaderData<typeof loader>();

  const { buyItNowPrice, description, title, images, seller } = listing;

  return (
    <main className="container mx-auto max-w-screen-xl p-4">
      <Card>
        <div className="mx-auto max-w-2xl py-16 px-2 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
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
            <div className="mt-10 px-2 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {title}
              </h1>
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl font-bold">£{buyItNowPrice}</p>
              </div>
              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6 text-base">{description}</div>
              </div>
              <div className="mt-3">
                <SellerDetails {...seller} />
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
