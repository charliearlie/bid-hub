import { Link } from "@remix-run/react";
import { ChevronRight, Star } from "lucide-react";

import { Separator } from "~/components/common/ui/separator";

import { cn } from "~/util/utils";

type Props = {
  avatarUrl: string | null;
  feedbackScore: number | null;
  username: string;
};

export const SellerDetails = ({
  avatarUrl,
  feedbackScore,
  username,
}: Props) => {
  const avatar =
    avatarUrl || "https://avatars.githubusercontent.com/u/10001?v=4";
  return (
    <div>
      <Separator />
      <Link to="" className="group block flex-shrink-0 py-2">
        <div className="flex items-center">
          <div>
            <img
              className="inline-block h-11 w-[3.2rem] rounded-full sm:h-14 sm:w-[3.9rem]"
              src={avatar}
              alt=""
            />
          </div>
          <div className="ml-3 flex w-full items-center justify-between">
            <div>
              <p className="text-sm font-black sm:text-base">{username}</p>
              <RatingStars feedbackScore={feedbackScore} />
            </div>
            <span className="flex gap-2 text-sm opacity-80 group-hover:opacity-100 sm:text-base">
              View seller profile <ChevronRight />
            </span>
          </div>
        </div>
      </Link>
      <Separator />
    </div>
  );
};

const RatingStars = ({ feedbackScore }: { feedbackScore: number | null }) => {
  if (!feedbackScore) {
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
      {[0, 1, 2, 3, 4].map((rating) => (
        <Star
          key={rating}
          className={cn(
            feedbackScore > rating
              ? "fill-primary text-primary"
              : "fill-text-foreground text-foreground",
            "h-5 w-5 flex-shrink-0 text-sm md:text-base"
          )}
          strokeWidth={2}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};
