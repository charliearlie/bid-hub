import { Link } from "@remix-run/react";
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
        <div className="h-24">
          <Link
            prefetch="intent"
            to={`$/listings/${slug}`}
            className="hover:opacity-80"
          >
            <h3 className="block font-black leading-none">
              <span className="block text-3xl">{title}</span>
              <span className="block text-xl">£{highestBidValue}</span>
            </h3>
          </Link>
        </div>
        <p className="font-semi-bold text-xl">£{buyItNowPrice}</p>
      </CardContent>
    </Card>
  );
}
