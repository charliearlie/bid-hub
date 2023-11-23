import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { DataFunctionArgs, json } from "@remix-run/node";
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

import { loader as userLoader } from "../$username_";

const UserFeedbackSchema = z.object({
  review: z.string().optional(),
});

export const action = async ({ params, request }: DataFunctionArgs) => {
  invariantResponse(params.username, "No username provided");
  const user = await getUserByUsernameOrEmail(params.username);
  invariantResponse(user, "Failed to find user");

  const loggedInUserId = await getUserId(request);

  const formData = await request.formData();
  const submission = parse(formData, { schema: UserFeedbackSchema });

  if (!loggedInUserId) {
    submission.error[""] = ["You need to ne logged in to leave feedback"];
    return json({ status: "error", submission } as const);
  }

  if (submission.intent !== "submit" || !submission.value) {
    return json({ status: "idle", submission } as const);
  }

  const { review } = submission.value;

  if (!review) {
    submission.error[""] = ["We failed to create your listing"];
    return json({ status: "error", submission } as const);
  }

  await prisma.userFeedback.create({
    data: {
      buyerId: loggedInUserId,
      review: review,
      sellerId: user.id,
      rating: 5,
    },
  });

  return json({ status: "success", submission } as const);
};

export default function UserReviews() {
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();
  const [form, fields] = useForm({
    id: "user-feedback",
    constraint: getFieldsetConstraint(UserFeedbackSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: UserFeedbackSchema });
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
            {...form.props}
            method="post"
          >
            <FormFieldTextArea
              className="h-32"
              label="Leave feedback"
              {...conform.input(fields.review)}
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
