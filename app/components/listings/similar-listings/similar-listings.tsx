import type { ListingPreviewType } from "~/types";

import { ListingPreview } from "..";

type Props = {
  listings: ListingPreviewType[];
};

export const SimilarListings = ({ listings }: Props) => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold">Similar listings</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing, i) => (
          <ListingPreview key={i} asCard includeDescription listing={listing} />
        ))}
      </div>
    </div>
  );
};
