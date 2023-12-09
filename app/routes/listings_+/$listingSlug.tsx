import { defer, json } from "@remix-run/node";
import type { MetaFunction, DataFunctionArgs } from "@remix-run/node";
import { Await, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import { RatingStars } from "~/components/common/star-rating/star-rating";
import { Button } from "~/components/common/ui/button";
import { Card } from "~/components/common/ui/card";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { CategoryBreadcrumbs } from "~/components/listings/category-breadcrumbs";
import { ImageGalleryTabs } from "~/components/listings/image-gallery-tabs";
import { ListingAdditionalDetailsSection } from "~/components/listings/listing-additional-details-section/listing-additional-details-section";
import { SellerDetails } from "~/components/listings/seller-details";
import { SimilarListings } from "~/components/listings/similar-listings/similar-listings";
import { SimilarListingsSkeleton } from "~/components/listings/similar-listings/similar-listings-skeleton";
import { WishlistButton } from "~/components/listings/wishlist/wishlist-button";

import { getCategoryAndParents } from "~/services/category.server";
import {
  doesUserLikeListing,
  getListingBySlug,
  getListingsByCategory,
  toggleLikeOnListing,
} from "~/services/listings.server";
import { getUserId } from "~/services/session.server";

import { optimiseImageForBrowser } from "~/util/cloudinary.server";
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

export async function action({ request }: DataFunctionArgs) {
  const currentUserId = await getUserId(request);
  const formData = await request.formData();

  const listingId = formData.get("listingId");
  const intent = formData.get("intent");

  invariant(typeof listingId === "string", "Expected listingId in form data");

  if (intent === "favourite") {
    if (currentUserId) {
      await toggleLikeOnListing(listingId, currentUserId!);
    }
    return json({ success: true } as const);
  }

  // todo: add to bag

  return json({ success: true } as const);
}

export async function loader({ params, request }: DataFunctionArgs) {
  invariant(params.listingSlug, "Expected params.listingSlug");
  const currentUserId = await getUserId(request);
  const { listing, numberOfReviews } = await getListingBySlug(
    params.listingSlug
  );

  invariantResponse(listing, "Listing not found", {
    status: 404,
  });

  const category = await getCategoryAndParents(listing.categoryId);

  const optimisedListingImages = await Promise.all(
    listing.images.map((image) => optimiseImageForBrowser(image))
  );

  const userLikesListing = currentUserId
    ? await doesUserLikeListing(currentUserId, listing.id)
    : false;

  const similarListingsPromise = getListingsByCategory(listing.categoryId, 6);

  return defer({
    category,
    listing: { ...listing, images: optimisedListingImages },
    numberOfReviews,
    userLikesListing,
    similarListings: similarListingsPromise,
  });
}

export default function ListingSlugRoute() {
  const fetcher = useFetcher();
  const {
    category,
    listing,
    numberOfReviews,
    similarListings,
    userLikesListing,
  } = useLoaderData<typeof loader>();

  const {
    buyItNowPrice,
    description,
    fulfilmentOptions,
    productDetails,
    rating,
    title,
    images,
    seller,
  } = listing;

  const likesListing =
    fetcher.formData?.get("intent") === "favourite"
      ? !userLikesListing
      : userLikesListing;

  return (
    <main className="container mx-auto max-w-screen-xl p-4">
      <Card>
        <div className="mx-auto max-w-2xl px-2 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
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
            <div className="mt-10 flex flex-col gap-4 px-2 sm:mt-16 sm:px-0 lg:mt-0">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {title}
                </h1>
                <RatingStars
                  numberOfRatings={numberOfReviews}
                  rating={rating}
                />
              </div>
              <div>
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6 text-base">{description}</div>
              </div>
              <div>
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl font-bold">£{buyItNowPrice}</p>
              </div>
              <fetcher.Form method="post">
                <div className="flex items-center gap-2 sm:grid sm:grid-cols-2">
                  <Button
                    className="flex-grow"
                    name="intent"
                    size="lg"
                    value="bag"
                    type="submit"
                  >
                    Add to bag
                  </Button>
                  <WishlistButton
                    className="w-16 sm:w-auto"
                    inWishlist={likesListing}
                  />
                  <input type="hidden" name="listingId" value={listing.id} />
                </div>
              </fetcher.Form>
              <div className="mt-3">
                <SellerDetails {...seller} listingSlug={listing.slug} />
              </div>
              <ListingAdditionalDetailsSection
                productDetails={productDetails}
                fulfilmentOptions={fulfilmentOptions}
              />
            </div>
          </div>
        </div>
        <div className="px-4 sm:py-8">
          <Suspense fallback={<SimilarListingsSkeleton />}>
            <Await resolve={similarListings}>
              {(listings) => <SimilarListings listings={listings} />}
            </Await>
          </Suspense>
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
