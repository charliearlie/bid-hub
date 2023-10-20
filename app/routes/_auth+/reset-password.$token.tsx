import type { ActionFunctionArgs } from "@remix-run/node";
import { useNavigation } from "@remix-run/react";
import { typedjson, useTypedActionData } from "remix-typedjson";

import Alert, { AlertType } from "~/components/common/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import Spinner from "~/components/spinner";
import Button from "~/components/common/button";
import { resetPassword } from "~/services/user.server";

type ActionData =
  | { password: null | string; confirmPassword: null | string }
  | undefined;

export async function action({ request, params }: ActionFunctionArgs) {
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
  const navigation = useNavigation();

  return (
    <div>
      <h2 className="pt-4 text-center text-3xl font-bold">Reset password</h2>
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
            {navigation.state !== "idle" ? <Spinner /> : "Reset password"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
