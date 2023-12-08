import { Link } from "@remix-run/react";

import type { ListingPreviewType } from "~/types";

type ListingPreviewProps = {
  includeDescription?: boolean;
  listing: ListingPreviewType;
};

export default function ListingPreview({
  includeDescription = false,
  listing,
}: ListingPreviewProps) {
  const { buyItNowPrice, description, slug, thumbnail, title } = listing;

  return (
    <Link prefetch="intent" to={`/listings/${slug}`}>
      <div className="p-2">
        <img
          className="h-64 w-full rounded-lg object-cover"
          src={thumbnail || "https://picsum.photos/200"}
          alt={title}
        />
        <div className="flex flex-col gap-2 py-2">
          <div className="h-10">
            <h3 className="block max-h-8 overflow-hidden text-ellipsis font-medium leading-none">
              <span className="block font-semibold">{title}</span>
            </h3>
          </div>
          {includeDescription && (
            <div>
              <p className="line-clamp-2 text-sm">{description}</p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-xl">£{buyItNowPrice}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
