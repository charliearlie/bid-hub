import { HeartIcon } from "lucide-react";

import { Button } from "~/components/common/ui/button";

import { cn } from "~/util/utils";

type Props = {
  inWishlist: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export const WishlistButton = ({ className, inWishlist }: Props) => {
  return (
    <Button
      name="intent"
      value="favourite"
      variant="outline"
      size="lg"
      className={cn("group flex items-center gap-2", className)}
    >
      <HeartIcon
        className={cn(
          "h-6 w-6 flex-shrink-0 text-primary-foreground group-hover:fill-destructive group-hover:text-destructive",
          inWishlist &&
            "fill-destructive text-destructive group-hover:fill-accent group-hover:text-foreground dark:text-destructive"
        )}
        aria-hidden="true"
      />
      <span className="hidden sm:flex">
        {inWishlist ? "In wishlist" : "Add to Wishlist"}
      </span>
      <span className="sr-only">Add to favorites</span>
    </Button>
  );
};
