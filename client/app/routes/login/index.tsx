import React, { useRef } from "react";
import { Link, useActionData, useTransition } from "@remix-run/react";
import { ActionArgs, ActionFunction, json } from "@remix-run/node";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import { createUserSession } from "~/session.server";
import { requestClient } from "~/gql/util/gql-request";
import { LOGIN_USER } from "~/gql/mutations/login-user";
import Spinner from "~/components/spinner";
import { SEND_MAGIC_LINK } from "~/gql/mutations/send-magic-link";

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
  const emailInputRef = useRef<HTMLInputElement>(null);
  const actionData = useActionData();
  const transition = useTransition();

  const handleMagicLinkClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // We'll do this for now but it makes more sense to move the magic link button out of the form
    e.stopPropagation();
    e.preventDefault();

    const userEmail = emailInputRef.current?.value;
    console.log(userEmail);

    if (userEmail) {
      await requestClient.request(SEND_MAGIC_LINK, {
        email: userEmail,
      });
    }

    console.log("Magic link button clicked", emailInputRef.current?.value);
  };

  return (
    <main className="flex flex-col flex-wrap content-center">
      <div className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md">
        <h1 className="text-center text-3xl font-bold">Log in to Bidhub</h1>
        <Form
          className=""
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
            ref={emailInputRef}
          />
          <FormField label="Password" name="password" type="password" />
          <div className="flex flex-col gap-2">
            <button className="rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
              {transition.state !== "idle" ? <Spinner /> : "Log in"}
            </button>
            <Link
              className="px-0 py-2 font-semibold text-blue-700 hover:text-slate-500"
              to="/user/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>
        </Form>
        <button
          className="w-full rounded bg-green-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900"
          onClick={() => console.log("clicked magic button")}
        >
          {transition.state !== "idle" ? <Spinner /> : "Send Magic Link"}
        </button>
        <button
          className="w-full rounded bg-green-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900"
          onClick={() => console.log("clicked magic button")}
        >
          Click to work
        </button>
      </div>
    </main>
  );
}
