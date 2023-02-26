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
import Button from "~/components/button";

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
    e.stopPropagation();
    e.preventDefault();

    const userEmail = emailInputRef.current?.value;

    if (userEmail) {
      await requestClient.request(SEND_MAGIC_LINK, {
        email: userEmail,
      });
    }
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
          <div className="flex flex-col">
            <Button variant="primary">
              {transition.state !== "idle" ? <Spinner /> : "Log in"}
            </Button>
            <Link
              className="px-0 pb-2 font-semibold text-blue-700 hover:text-slate-500"
              to="/user/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>
        </Form>
        <Button
          className="my-1 w-full"
          onClick={handleMagicLinkClick}
          type="button"
          variant="secondary"
        >
          {transition.state !== "idle" ? <Spinner /> : "Send Magic Link"}
        </Button>
      </div>
    </main>
  );
}
