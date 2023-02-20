import { Link } from "@remix-run/react";
import { Item } from "~/gql/graphql";

type ItemPreviewProps = {
  item: Item;
};

export default function ItemPreview({ item }: ItemPreviewProps) {
  const {
    id,
    bidCount,
    name,
    formattedBuyItNowPrice,
    formattedWinningBid,
    condition,
    hasBiddingEnabled,
    slug,
  } = item;

  const Price = () => {
    if (!formattedBuyItNowPrice && !hasBiddingEnabled) return null;

    return (
      <>
        {formattedBuyItNowPrice && (
          <p className="text-lg font-bold">{formattedBuyItNowPrice}</p>
        )}
        <span className="flex justify-between">
          <p className="text-xs font-bold text-green-600">Buy it now</p>
          {bidCount > 0 && (
            <p className="text-xs">
              {bidCount} bids ({formattedWinningBid})
            </p>
          )}
        </span>
      </>
    );
  };

  return (
    <Link to={`/item/${slug}/${id}`} className="flex gap-4 py-4 px-4">
      <div className="h-24 w-24 flex-none">
        <img src="https://ih1.redbubble.net/image.1003426384.0291/st,small,507x507-pad,600x600,f8f8f8.jpg" />
      </div>
      <div className="flex-auto">
        <h3 className="h-9 overflow-hidden font-black leading-none">{name}</h3>
        <Price />
        <p className="text-xs font-semibold">{condition}</p>
      </div>
    </Link>
  );
}
