import { ReviewType } from "~/types";

import { RatingStars } from "../common/star-rating/star-rating";
import { Separator } from "../common/ui/separator";

type Props = {
  reviews: Array<ReviewType>;
};

export const ReviewList = ({ reviews }: Props) => {
  return (
    <>
      <h3 className="sr-only">Customer Reviews</h3>

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
              <h3 className="font-medium text-foreground">
                {review.buyer.username}
              </h3>
              <p>
                <time className="opacity-60" dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </time>
              </p>

              <div className="mt-2 flex items-center">
                <RatingStars rating={review.rating} />
              </div>
              <p className="sr-only">{review.rating} out of 5 stars</p>

              <div className="prose prose-sm mt-4 max-w-none text-foreground">
                <p>{review.comment}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
