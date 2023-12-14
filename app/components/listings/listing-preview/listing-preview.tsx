import { Link } from "@remix-run/react";

import { Card } from "~/components/common/ui/card";

import type { ListingPreviewType } from "~/types";

type ListingPreviewProps = {
  asCard?: boolean;
  includeDescription?: boolean;
  listing: ListingPreviewType;
};

export default function ListingPreview({
  asCard = false,
  includeDescription = false,
  listing,
}: ListingPreviewProps) {
  const { buyItNowPrice, description, slug, thumbnail, title } = listing;

  const Comp = asCard ? Card : "div";

  return (
    <Link prefetch="intent" to={`/listings/${slug}`}>
      <Comp className="group">
        <img
          className="aspect-square w-full rounded-lg object-cover group-hover:opacity-75"
          src={thumbnail || "https://picsum.photos/200"}
          alt={title}
        />
        <div className="flex flex-col gap-2 p-2">
          <div className="h-10">
            <h3 className="block max-h-8 overflow-hidden text-ellipsis font-medium leading-none">
              <span className="block font-semibold">{title}</span>
            </h3>
          </div>
          {includeDescription && (
            <div className="h-7">
              <p className="block max-h-7 overflow-hidden text-ellipsis text-sm leading-none">
                {description}
              </p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-xl">£{buyItNowPrice}</p>
          </div>
        </div>
      </Comp>
    </Link>
  );
}
