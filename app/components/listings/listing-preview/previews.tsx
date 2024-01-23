import { ScrollableRow } from "~/components/common/ui/scrollable-row";

import type { ListingPreviewType } from "~/types";

import ListingPreview from "./listing-preview";

export default function Previews({
  listings,
}: {
  listings: ListingPreviewType[];
}) {
  return (
    <ScrollableRow>
      {listings.map((listing) => (
        <li key={listing.id} className="snap-start">
          <ListingPreview listing={listing} key={listing.slug} />
        </li>
      ))}
    </ScrollableRow>
  );
}
