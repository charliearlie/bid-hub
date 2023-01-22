import { Link, useActionData, useTransition } from "@remix-run/react";
import { ActionArgs, ActionFunction, json } from "@remix-run/node";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import { createUserSession } from "~/session.server";
import { gql, requestClient } from "~/util/gql-request";
import Spinner from "~/components/spinner";

const LOGIN_USER = gql`
  mutation Login($emailOrUsername: String!, $password: String!) {
    login(emailOrUsername: $emailOrUsername, password: $password) {
      user {
        id
        username
        email
      }
      errors {
        field
        message
      }
      success
      token
    }
  }
`;

type ActionData =
  | { emailOrUsername: null | string; password: null | string }
  | undefined;

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const emailOrUsername = formData.get("emailOrUsername");
  const password = formData.get("password");

  const errors: ActionData = {
    emailOrUsername: emailOrUsername ? null : "Email or username is required",
    password: password ? null : "Password is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  const response = await requestClient.request(LOGIN_USER, {
    emailOrUsername,
    password,
  });

  if (!response.login.success) {
    return json(response.login);
  }

  return createUserSession({
    request,
    userId: response.login.user.id,
    jwt: response.login.token,
  });
};

export default function LoginRoute() {
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <main>
      <div className="flex flex-col flex-wrap content-center">
        <h1 className="text-center text-3xl font-bold">Log in to Bidhub</h1>
        <Form
          className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
          initialFormValues={{
            emailOrUsername: "",
            password: "",
          }}
          method="post"
        >
          {actionData?.success === false && (
            <Alert
              message="Invalid email, username or password"
              type={AlertType.ERROR}
            />
          )}
          <FormField
            label="Email or username" // Could default label to input name with a capital letter?
            name="emailOrUsername"
            type="text"
          />
          <FormField label="Password" name="password" type="password" />
          <div className="flex justify-between">
            <button className="w-25 rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
              {transition.state !== "idle" ? <Spinner /> : "Log in"}
            </button>
            <Link
              className="px-0 py-2 font-semibold text-blue-700 hover:text-slate-500"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
}
