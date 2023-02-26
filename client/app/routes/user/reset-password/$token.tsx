import { useActionData, useTransition } from "@remix-run/react";
import { ActionArgs, ActionFunction, json } from "@remix-run/node";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import { gql, requestClient } from "~/gql/util/gql-request";
import Spinner from "~/components/spinner";
import { createUserSession } from "~/session.server";
import Button from "~/components/button";

const RESET_PASSWORD = gql`
  mutation ResetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token) {
      success
      user {
        id
      }
      token
    }
  }
`;

type ActionData =
  | { password: null | string; confirmPassword: null | string }
  | undefined;

export const action: ActionFunction = async ({
  params,
  request,
}: ActionArgs) => {
  const formData = await request.formData();

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const errors: ActionData = {
    password: password ? null : "Password is required",
    confirmPassword: confirmPassword ? null : "Please confirm your password",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  const response = await requestClient.request(RESET_PASSWORD, {
    newPassword: password,
    token: params.token,
  });

  if (!response.resetPassword.success) {
    return json(response.resetPassword.success);
  }

  return createUserSession({
    request,
    userId: response.resetPassword.user.id,
    jwt: response.resetPassword.token,
  });
};

export default function ForgotPasswordRoute() {
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <main>
      <div className="flex flex-col flex-wrap content-center">
        <h1 className="text-center text-3xl font-bold">Reset password</h1>
        <p className="text-center">Enter your new password</p>
        {/* We should add a link to go back to requesting a reset link */}
        {actionData?.success && (
          <Alert type={AlertType.ERROR} message="Something went wrong" />
        )}
        <Form
          className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
          initialFormValues={{
            password: "",
            confirmPassword: "",
          }}
          method="post"
        >
          <FormField label="Password" name="password" type="text" />
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="text"
          />
          <div className="flex justify-center">
            <Button className="w-25">
              {transition.state !== "idle" ? <Spinner /> : "Reset password"}
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}
