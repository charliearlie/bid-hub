import { json, type DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getListingBySlug } from "~/services/listings.server";

import { Button } from "~/components/common/ui/button";
import Card from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import CardHeader from "~/components/common/ui/card/card-header";
import { ErrorBoundaryComponent } from "~/components/error-boundary";

import { invariantResponse } from "~/util/utils";

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

  invariantResponse(listing, "Listing not found", { status: 404 });

  return json({ listing });
}

export default function ListingSlugRoute() {
  const { listing } = useLoaderData<typeof loader>();

  const {
    item: { name, image, description },
    buyItNowPrice,
    highestBidValue,
    title,
  } = listing;

  return (
    <main className="">
      <img
        className=" h-72 w-full object-cover lg:h-[32rem]"
        src={image || ""}
        alt={name}
      />
      <div className="flex flex-col gap-8 p-4 md:flex-row md:p-12">
        <div className="w-full">
          <h1 className="text-2xl font-black md:text-4xl">{title}</h1>
          <p>{description}</p>I could easily make the cards below tabs but they
          may vary in height which will cause a disgusting content shift
          <Card>
            <CardHeader>Key figures</CardHeader>
            <CardContent>
              <div className="px-2">
                £{highestBidValue}£{buyItNowPrice}
              </div>
            </CardContent>
          </Card>
          <Button variant="default">Like</Button>
        </div>
      </div>
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
