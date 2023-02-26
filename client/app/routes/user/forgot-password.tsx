import { useActionData, useTransition } from "@remix-run/react";
import { ActionArgs, ActionFunction, json } from "@remix-run/node";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import { gql, requestClient } from "~/gql/util/gql-request";
import Spinner from "~/components/spinner";
import Button from "~/components/button";

const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

type ActionData = { email: null | string } | undefined;

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");

  const errors: ActionData = {
    email: email ? null : "Email is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  const response = await requestClient.request(FORGOT_PASSWORD, { email });

  return json({ success: response.forgotPassword });
};

export default function ForgotPasswordRoute() {
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <main>
      <div className="flex flex-col flex-wrap content-center">
        <h1 className="text-center text-3xl font-bold">Reset password</h1>
        <p className="text-center">
          Enter your email address to be sent a reset token
        </p>
        <Form
          className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
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
            <Button className="w-25">
              {transition.state !== "idle" ? <Spinner /> : "Send me a link"}
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}
