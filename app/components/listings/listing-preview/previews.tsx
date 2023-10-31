import ListingPreview from "./listing-preview";
import type { ListingPreviewType } from "~/util/types";

export default function Previews({
  listings,
}: {
  listings: ListingPreviewType[];
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing, idx) => (
        <li className="rounded" key={listing.slug}>
          <ListingPreview listing={listing} />
        </li>
      ))}
    </ul>
  );
}
