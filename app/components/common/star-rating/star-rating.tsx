import { Star } from "lucide-react";

import { cn } from "~/util/utils";

export const RatingStars = ({
  numberOfRatings,
  rating,
}: {
  numberOfRatings?: number;
  rating: number | null;
}) => {
  if (!rating) {
    return (
      <div className="flex items-center">
        <p className="text-sm font-medium text-foreground opacity-60">
          No ratings yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {[0, 1, 2, 3, 4].map((idx) => (
        <Star
          key={idx}
          className={cn(
            rating > idx
              ? "fill-primary text-primary"
              : "fill-text-foreground text-foreground",
            "h-5 w-5 flex-shrink-0 text-sm md:text-base"
          )}
          strokeWidth={2}
          aria-hidden="true"
        />
      ))}
      {numberOfRatings && <span className="ml-2">({numberOfRatings})</span>}
    </div>
  );
};
