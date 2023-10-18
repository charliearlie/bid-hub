import { Link, useActionData, useTransition } from "@remix-run/react";
import type {
  ActionArgs,
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import Alert, { AlertType } from "~/components/common/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import { getUser } from "~/services/session.server";
import Spinner from "~/components/spinner";
import Button from "~/components/common/button";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "~/services/validators.server";
import { register } from "~/services/user.server";
import { typedjson, useTypedActionData } from "remix-typedjson";
import { RegisterResponse } from "~/services/types.server";

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect("/") : null;
};

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return typedjson<RegisterResponse>({
      success: false,
      errors: { server: `Invalid Form Data` },
    });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    username: validateUsername(username),
  };

  if (Object.values(errors).some(Boolean))
    return typedjson<RegisterResponse>({
      success: false,
      errors,
    });

  return await register({ email, password, username });
}

export default function RegisterRoute() {
  // todo: fix actionData type
  const actionData = useTypedActionData<typeof action>();
  const transition = useTransition();
  return (
    <main className="flex h-screen flex-col flex-wrap content-center justify-center bg-gray-800 sm:bg-gray-700">
      <div className="mb-4 w-full max-w-md px-8 pt-6 pb-10 sm:border-2 sm:border-solid sm:border-gray-700 sm:bg-gray-800">
        <h1 className="pt-4 pb-8 text-center text-3xl font-bold">
          Join Brake Neck
        </h1>
        <Form
          className=""
          initialFormValues={{
            email: "",
            password: "",
            username: "",
          }}
          method="post"
        >
          {actionData?.success === false && actionData?.errors?.server && (
            <Alert
              message={actionData?.errors?.server}
              type={AlertType.ERROR}
            />
          )}
          <FormField
            label="Username"
            name="username"
            type="text"
            errorMessage={actionData?.errors?.username}
          />
          <FormField
            label="Email"
            name="email"
            type="text"
            errorMessage={actionData?.errors?.email}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            errorMessage={actionData?.errors?.password}
          />
          <div className="flex justify-between">
            <Button className="w-25" variant="primary">
              {transition.state !== "idle" ? <Spinner /> : "Sign up"}
            </Button>
            <Link
              className="px-0 py-2 font-semibold text-blue-500 hover:text-slate-500"
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
