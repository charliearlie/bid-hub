import { ScrollableRow } from "~/components/common/ui/scrollable-row";
import ListingPreview from "./listing-preview";
import type { ListingPreviewType } from "~/util/types";

export default function Previews({
  listings,
}: {
  listings: ListingPreviewType[];
}) {
  return (
    <ul>
      <ScrollableRow>
        {listings.map((listing) => (
          <div className="snap-center">
            <ListingPreview listing={listing} key={listing.slug} />
          </div>
        ))}
      </ScrollableRow>
    </ul>
  );
}
