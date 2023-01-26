import { Link, useActionData, useTransition } from "@remix-run/react";
import { ActionArgs, ActionFunction, json } from "@remix-run/node";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import { createUserSession } from "~/session.server";
import { gql, requestClient } from "~/gql/util/gql-request";
import Spinner from "~/components/spinner";

const REGISTER_USER = gql`
  mutation Register($email: String!, $password: String!, $username: String!) {
    register(
      userInput: { email: $email, password: $password, username: $username }
    ) {
      user {
        id
        username
        email
        createdAt
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
  | { email: null | string; password: null | string; username: null | string }
  | undefined;

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  const errors: ActionData = {
    email: email ? null : "Email is required",
    password: password ? null : "Password is required",
    username: username ? null : "Username is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  const response = await requestClient.request(REGISTER_USER, {
    email,
    password,
    username,
  });

  console.log("response.register", response.register);
  if (!response.register.success) {
    return json(response.register);
  }

  return createUserSession({
    request,
    userId: response.register.user.id,
    jwt: response.register.token,
  });
};

export default function RegisterRoute() {
  const actionData = useActionData();
  const transition = useTransition();
  return (
    <main>
      <div className="flex flex-col flex-wrap content-center">
        <h1 className="text-center text-3xl font-bold">Join Bidhub</h1>
        <Form
          className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
          initialFormValues={{
            email: "",
            password: "",
            username: "",
          }}
          method="post"
        >
          {actionData?.success === false && (
            <Alert message="All fields are required" type={AlertType.ERROR} />
          )}
          <FormField label="Username" name="username" type="text" />
          <FormField label="Email" name="email" type="text" />
          <FormField label="Password" name="password" type="password" />
          <div className="flex justify-between">
            <button className="w-25 rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
              {transition.state === "idle" ? <Spinner /> : "Sign up"}
            </button>
            <Link
              className="px-0 py-2 font-semibold text-blue-700 hover:text-slate-500"
              to="/login"
            >
              Already registered?
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
}
