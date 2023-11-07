import { Link } from "@remix-run/react";
import { Badge } from "~/components/common/ui/badge";
import Card from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import CardImage from "~/components/common/ui/card/card-image";
import type { ListingPreviewType } from "~/util/types";

type ListingPreviewProps = {
  listing: ListingPreviewType;
};

export default function ListingPreview({ listing }: ListingPreviewProps) {
  const { buyItNowPrice, highestBidValue, slug, title } = listing;

  const firstImage = listing.images?.[0];

  return (
    <Card>
      <CardImage
        to={`/listings/${slug}`}
        src={firstImage ? firstImage : "https://picsum.photos/200"}
        alt={title}
      />
      <CardContent>
        <div className="h-8">
          <Link
            prefetch="intent"
            to={`$/listings/${slug}`}
            className="hover:opacity-80"
          >
            <h3 className="block max-h-8 overflow-hidden text-ellipsis font-medium leading-none">
              <span className="block">{title}</span>
            </h3>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            {buyItNowPrice && (
              <>
                <p className="text-xl font-bold">£{buyItNowPrice}</p>
                <p className="text-sm font-semibold">Buy now</p>
              </>
            )}
          </div>
          <div className="flex flex-col items-end">
            {highestBidValue && (
              <>
                <p className="text-xl font-light">£{highestBidValue}</p>
                <Badge>ends 3d</Badge>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
