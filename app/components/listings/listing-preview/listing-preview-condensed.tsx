import { ListingPreviewType } from "~/types";

type ListingPreviewCondensedProps = {
  listing: ListingPreviewType;
};

const ListingPreviewCondensed = ({ listing }: ListingPreviewCondensedProps) => {
  return (
    <div className="flex gap-2 py-2">
      <img
        className="h-24 w-24 rounded-lg border border-border object-contain sm:h-36 sm:w-36"
        src={listing.thumbnail}
        alt={listing.title}
      />
      <div>
        <h3 className="text-xl sm:text-2xl">{listing.title}</h3>
        <p className="text-lg font-semibold sm:text-xl">
          £{listing.buyItNowPrice}
        </p>
        <p className="hidden text-sm font-light sm:block">
          {listing.description}
        </p>
      </div>
    </div>
  );
};

export default ListingPreviewCondensed;
