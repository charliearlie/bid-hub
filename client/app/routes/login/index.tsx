import { Link, useActionData, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/router";
import FormField from "~/components/form/form-field";
import Alert, { AlertType } from "~/components/alert";
import Spinner from "~/components/spinner";
import Form, { FormData } from "~/components/form/form";
import { ActionArgs, ActionFunction, json } from "@remix-run/node";
import { gql, request as gqlRequest } from "graphql-request";
import { requestClient } from "~/util/gql-request";

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
    }
  }
`;

type ActionData = { email: null | string; password: null | string } | undefined;

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const errors: ActionData = {
    email: email ? null : "Email is required",
    password: password ? null : "Password is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  const response = await requestClient.request(LOGIN_USER, { email, password });

  if (!response.success) {
    return json(response.login);
  }

  return redirect("/");
};

export default function LoginRoute() {
  const actionData = useActionData();
  const transition = useTransition();
  console.log(transition);

  const isSubmitting = Boolean(transition.submission);
  return (
    <main>
      <div className="flex flex-col flex-wrap content-center">
        <h1 className="text-center text-3xl font-bold">Log in to Bidhub</h1>
        <Form
          className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
          initialFormValues={{
            email: "",
            password: "",
          }}
          method="post"
        >
          {actionData?.success === false && (
            <Alert message="Invalid email or password" type={AlertType.ERROR} />
          )}
          <FormField
            label="Email" // Could default label to input name with a capital letter?
            name="email"
            type="text"
          />
          <FormField label="Password" name="password" type="password" />
          <div className="flex justify-between">
            <button className="w-20 rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
              {isSubmitting ? <Spinner /> : "Log in"}
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
