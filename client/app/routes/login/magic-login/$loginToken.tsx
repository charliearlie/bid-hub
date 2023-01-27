import { useActionData, useTransition } from "@remix-run/react";
import {
  ActionArgs,
  ActionFunction,
  DataFunctionArgs,
  json,
  LoaderFunction,
} from "@remix-run/node";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import {
  gql,
  requestClient,
  requestWithCredentials,
} from "~/gql/util/gql-request";
import Spinner from "~/components/spinner";
import { createUserSession } from "~/session.server";
import { HANDLE_MAGIC_EMAIL_LOGIN } from "~/gql/mutations";

export const loader: LoaderFunction = async ({
  params,
  request,
}: DataFunctionArgs) => {
  const response = await requestClient.request(HANDLE_MAGIC_EMAIL_LOGIN);

  console.log(response);

  return createUserSession({
    request,
    userId: response.login.user.id,
    jwt: response.login.token,
  });
};

export default function LoginTokenRoute() {
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
            <button className="w-25 rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
              {transition.state !== "idle" ? <Spinner /> : "Reset password"}
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
