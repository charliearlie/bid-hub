import { ScrollableRow } from "~/components/common/ui/scrollable-row";
import ListingPreview from "./listing-preview";
import type { ListingPreviewType } from "~/util/types";

export default function Previews({
  listings,
}: {
  listings: ListingPreviewType[];
}) {
  return (
    <ScrollableRow>
      {listings.map((listing) => (
        <ul key={listing.id} className="snap-start">
          <ListingPreview listing={listing} key={listing.slug} />
        </ul>
      ))}
    </ScrollableRow>
  );
}
