import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";

import {
  getUserResetTokenData,
  isTokenValid,
  resetForgottenPassword,
} from "~/services/user.server";

import { Alert, AlertTitle } from "~/components/common/ui/alert";
import FormField from "~/components/form/form-field";
import { SubmitButton } from "~/components/form/submit-button";

import { invariantResponse } from "~/util/utils";

const ResetPasswordTokenFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export async function action({ request, params }: ActionFunctionArgs) {
  invariantResponse(params.token, "Token must exist");
  const formData = await request.formData();

  const submission = parse(formData, { schema: ResetPasswordTokenFormSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ status: "idle", submission } as const);
  }

  const resetTokenData = await getUserResetTokenData(params.token);

  if (!resetTokenData?.email) {
    return json({ status: "error", submission } as const, {
      status: 400,
    });
  }

  const { expiration, token } = resetTokenData;

  const isValidToken = await isTokenValid(token, expiration);

  return isValidToken
    ? resetForgottenPassword(resetTokenData, submission.value.password)
    : json({ status: "error", submission } as const);
}

export default function ForgotPasswordRoute() {
  const actionData = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "reset-password-token-form",
    lastSubmission: actionData?.submission,
    constraint: getFieldsetConstraint(ResetPasswordTokenFormSchema),
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: ResetPasswordTokenFormSchema });
    },
  });

  return (
    <div>
      <h2 className="pt-4 text-center text-3xl font-bold">Reset password</h2>
      <p className="pb-8 text-center">Enter your new password</p>
      {/* todo: We should add a link to go back to requesting a reset link */}
      {actionData?.status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
        </Alert>
      )}
      <Form className="" method="post" {...form.props}>
        <FormField
          label="Password"
          name="password"
          type="text"
          errors={fields.password.errors}
        />
        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="text"
          errors={fields.confirmPassword.errors}
        />
        <div className="flex justify-center">
          <SubmitButton className="w-full">Reset password</SubmitButton>
        </div>
      </Form>
    </div>
  );
}
