import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";

import type { ReviewType } from "~/types";

import { RatingStars } from "../common/star-rating/star-rating";
import { Button } from "../common/ui/button";
import { Separator } from "../common/ui/separator";

type Props = {
  reviews: Array<ReviewType>;
  showHeading?: boolean;
};

export const ReviewList = ({ reviews, showHeading }: Props) => {
  return (
    <div>
      <h2 className={showHeading ? "text-2xl font-bold" : "sr-only"}>
        Customer Reviews
      </h2>

      {reviews.map((review, reviewIdx) => (
        <div
          key={review.buyer.username}
          className="flex space-x-4 text-sm text-foreground"
        >
          <div className="flex-none py-8">
            <img
              src={review.buyer.avatarUrl || ""}
              alt=""
              className="h-10 w-10 rounded-full bg-gray-100"
            />
          </div>
          <div className="w-full">
            {reviewIdx !== 0 ? <Separator /> : null}
            <div className="py-8">
              <h3 className="text-lg font-semibold text-foreground">
                {review.buyer.username}
              </h3>
              <Link to={`/listings/${review.listing.slug}`}>
                {review.listing.title}
              </Link>
              <p>
                <time className="opacity-60" dateTime={review.createdAt}>
                  {dayjs(review.createdAt).format("DD MMMM YYYY")}
                </time>
              </p>

              <div className="mt-2 flex items-center">
                <RatingStars rating={review.rating} />
                <p className="sr-only">{review.rating} out of 5 stars</p>
              </div>
              <div className="prose prose-sm mt-4 max-w-none text-foreground">
                <p>{review.comment}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex w-full justify-end">
        <Button variant="outline">
          View all reviews <ArrowRight />
        </Button>
      </div>
    </div>
  );
};
