import { useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs, ActionFunction } from "@remix-run/node";
import { typedjson, useTypedActionData } from "remix-typedjson";

import Alert, { AlertType } from "~/components/common/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import Spinner from "~/components/spinner";
import Button from "~/components/common/button";
import { forgotPassword } from "~/services/user.server";

type ActionData = { email: null | string; success: boolean } | undefined;

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");

  if (typeof email !== "string") {
    return typedjson<ActionData>({
      email: "Email is required",
      success: false,
    });
  }

  return await forgotPassword(email);
};

export default function ForgotPasswordRoute() {
  const actionData = useTypedActionData<ActionData>();
  const navigation = useNavigation();

  return (
    <div>
      <h2 className="pt-4 text-center text-3xl font-bold">Reset password</h2>
      <p className="pb-8 text-center">
        Enter your email address to be sent a reset token
      </p>
      <Form
        className="mb-4 pt-6"
        initialFormValues={{
          email: "",
        }}
        method="post"
      >
        {actionData?.success && (
          <Alert
            message="A reset token has been sent to your email address"
            type={AlertType.INFO}
          />
        )}
        <FormField label="Email" name="email" type="text" />
        <div className="flex justify-center">
          <Button className="w-full">
            {navigation.state !== "idle" ? <Spinner /> : "Send me a link"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
