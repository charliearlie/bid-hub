import { Link } from "@remix-run/react";
import { ChevronRight } from "lucide-react";

import { RatingStars } from "~/components/common/star-rating/star-rating";
import { Separator } from "~/components/common/ui/separator";

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
      <Link to={`/user/${username}`} className="group block flex-shrink-0 py-2">
        <div className="flex items-center">
          <div>
            <img
              className="inline-block h-11 w-12 rounded-lg sm:h-14 sm:w-16"
              src={avatar}
              alt=""
            />
          </div>
          <div className="ml-3 flex w-full items-center justify-between">
            <div>
              <p className="text-sm font-black sm:text-base">{username}</p>
              <RatingStars rating={feedbackScore} />
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
