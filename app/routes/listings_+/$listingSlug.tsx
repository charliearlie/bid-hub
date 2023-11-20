import { json, type DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { HeartIcon } from "lucide-react";
import invariant from "tiny-invariant";

import {
  doesUserLikeListing,
  getCategoryAndParents,
  getListingBySlug,
  toggleLikeOnListing,
} from "~/services/listings.server";
import { getUserId } from "~/services/session.server";

import { Button } from "~/components/common/ui/button";
import Card from "~/components/common/ui/card/card";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { CategoryBreadcrumbs } from "~/components/listings/category-breadcrumbs";
import { ImageGalleryTabs } from "~/components/listings/image-gallery-tabs";
import { ListingAdditionalDetailsSection } from "~/components/listings/listing-additional-details-section/listing-additional-details-section";
import { SellerDetails } from "~/components/listings/seller-details";

import { optimiseImageForBrowser } from "~/util/cloudinary.server";
import { cn, invariantResponse } from "~/util/utils";

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
    await toggleLikeOnListing(listingId, currentUserId);
    return json({ success: true } as const);
  }

  // todo: add to bag

  return json({ success: true } as const);
}

export async function loader({ params, request }: DataFunctionArgs) {
  invariant(params.listingSlug, "Expected params.listingSlug");
  const currentUserId = await getUserId(request);
  const listing = await getListingBySlug(params.listingSlug);

  invariantResponse(listing, "Listing not found", {
    status: 404,
  });

  const category = await getCategoryAndParents(listing.categoryId);

  const optimisedListingImages = await Promise.all(
    listing.images.map((image) => optimiseImageForBrowser(image))
  );

  const userLikesListing = await doesUserLikeListing(currentUserId, listing.id);

  return json({
    category,
    listing: { ...listing, images: optimisedListingImages },
    userLikesListing,
  });
}

export default function ListingSlugRoute() {
  const fetcher = useFetcher();
  const { category, listing, userLikesListing } =
    useLoaderData<typeof loader>();

  const { buyItNowPrice, description, title, images, seller } = listing;

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
              <fetcher.Form method="post" className="mt-6">
                <div className="mt-10 flex items-center">
                  <Button
                    className="basis-4/5 sm:basis-2/4"
                    name="intent"
                    value="bag"
                    type="submit"
                  >
                    Add to bag
                  </Button>
                  <button
                    name="intent"
                    value="favourite"
                    className="group ml-4 flex items-center justify-center rounded-md py-3 px-3 text-accent"
                  >
                    <HeartIcon
                      className={cn(
                        "h-6 w-6 flex-shrink-0 text-foreground group-hover:fill-destructive group-hover:text-destructive dark:text-accent",
                        likesListing &&
                          "fill-destructive text-destructive group-hover:fill-accent group-hover:text-foreground dark:text-destructive"
                      )}
                      aria-hidden="true"
                    />
                    <span className="sr-only">Add to favorites</span>
                  </button>
                  <input type="hidden" name="listingId" value={listing.id} />
                </div>
              </fetcher.Form>
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
