import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useFetcher } from "@remix-run/react";
import { SendIcon } from "lucide-react";
import { z } from "zod";

import { FormFieldTextArea } from "~/components/form/form-field-text-area";
import { SubmitButton } from "~/components/form/submit-button";
import { ReviewList } from "~/components/reviews/review-list";

import { getUserId } from "~/services/session.server";
import { getUserByUsernameOrEmail } from "~/services/user.server";

import { prisma } from "~/util/prisma.server";
import { invariantResponse, useRouteLoaderDataTyped } from "~/util/utils";

import type { loader as userLoader } from "../$username_";

const UserFeedbackSchema = z.object({
  review: z.string().optional(),
});

export const action = async ({ params, request }: DataFunctionArgs) => {
  invariantResponse(params.username, "No username provided");
  const user = await getUserByUsernameOrEmail(params.username);
  invariantResponse(user, "Failed to find user");

  const loggedInUserId = await getUserId(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: UserFeedbackSchema });

  if (!loggedInUserId) {
    return json(submission.reply({ formErrors: ["You need to be logged in"] }));
  }

  if (submission.status !== "success") {
    return json(
      { result: submission.reply(), status: submission.status } as const,
      {
        status: submission.status === "error" ? 400 : 200,
      }
    );
  }

  const { review } = submission.value;

  if (!review) {
    return json({
      result: submission.reply({ formErrors: ["Review is required"] }),
      status: "error",
    } as const);
  }

  await prisma.review.create({
    data: {
      buyerId: loggedInUserId,
      comment: review,
      sellerId: user.id,
      rating: 5,
      listingId: "025c64c8-3be8-49d9-afed-c48f4e2e97c4",
    },
  });

  return json({
    result: submission.reply({ resetForm: true }),
    status: "success" as const,
  });
};

export default function UserReviews() {
  const lastResult = useActionData<typeof action>();
  const fetcher = useFetcher();
  const [form, fields] = useForm({
    id: "user-feedback",
    constraint: getZodConstraint(UserFeedbackSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserFeedbackSchema });
    },
    shouldValidate: "onBlur",
  });

  const { feedbackReceived, isLoggedInUser } = useRouteLoaderDataTyped<
    typeof userLoader
  >("routes/user_+/$username_");

  const hasReviews = feedbackReceived?.length > 0;

  return (
    <div>
      {hasReviews && <ReviewList reviews={feedbackReceived} />}
      {!isLoggedInUser && (
        <div className="mx-auto flex max-w-xl justify-center p-8">
          <fetcher.Form
            className="flex w-full flex-col"
            {...getFormProps(form)}
            method="post"
          >
            <FormFieldTextArea
              className="h-32"
              label="Leave feedback"
              {...getInputProps(fields.review, { type: "text" })}
              placeholder="This won't live on this page. It's just here to ensure that adding feedback exists. Instead we're going to link a review to a listing and a URL to that listing in the review"
            />
            <SubmitButton className="self-end">
              <SendIcon />
            </SubmitButton>
          </fetcher.Form>
        </div>
      )}
    </div>
  );
}
