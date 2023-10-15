import type { ActionArgs } from "@remix-run/node";
import { useTransition } from "@remix-run/react";
import Alert, { AlertType } from "~/components/common/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import Spinner from "~/components/spinner";
import Button from "~/components/common/button";
import { resetPassword } from "~/services/user.server";
import { typedjson, useTypedActionData } from "remix-typedjson";

type ActionData =
  | { password: null | string; confirmPassword: null | string }
  | undefined;

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof password !== "string" || typeof params.token !== "string") {
    return typedjson({ success: false, errors: null });
  }

  const errors: ActionData = {
    password: password ? null : "Password is required",
    confirmPassword: confirmPassword ? null : "Please confirm your password",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return typedjson({ errors, success: false });
  }

  return resetPassword(password, params.token);
}

export default function ForgotPasswordRoute() {
  const actionData = useTypedActionData<typeof action>();
  const transition = useTransition();

  return (
    <main className="flex h-screen flex-col flex-wrap content-center justify-center bg-gray-800 sm:bg-gray-700">
      <div className="mb-4 w-full max-w-md px-8 pt-6 pb-10 sm:border-2 sm:border-solid sm:border-gray-700 sm:bg-gray-800">
        <h1 className="pt-4 text-center text-3xl font-bold">Reset password</h1>
        <p className="pb-8 text-center">Enter your new password</p>
        {/* We should add a link to go back to requesting a reset link */}
        {actionData?.success && (
          <Alert type={AlertType.ERROR} message="Something went wrong" />
        )}
        <Form
          className=""
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
            <Button className="w-full">
              {transition.state !== "idle" ? <Spinner /> : "Reset password"}
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}
