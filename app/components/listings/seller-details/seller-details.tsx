import { Link } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
import { useUser } from "~/contexts/user-context";

type Props = {
  avatarUrl: string | null;
  feedbackScore: number | null;
  listingSlug?: string;
  username: string;
};

export const SellerDetails = ({ avatarUrl, listingSlug, username }: Props) => {
  const avatar =
    avatarUrl || "https://avatars.githubusercontent.com/u/10001?v=4";
  const { username: loggedInUsername } = useUser();
  const isLoggedInUser = loggedInUsername === username;

  const ctaText = isLoggedInUser ? "Edit listing" : "View seller profile";
  const ctaUrl = isLoggedInUser
    ? `/listings/${listingSlug}/edit`
    : `/user/${username}/reviews`;
  return (
    <div>
      <Link to={ctaUrl} className="group block flex-shrink-0 pt-2">
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
              {/* <RatingStars rating={feedbackScore} /> */}
            </div>
            <span className="flex gap-2 text-sm opacity-80 group-hover:opacity-100 sm:text-base">
              <span className="hidden sm:block">{ctaText}</span>{" "}
              <ChevronRight />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
