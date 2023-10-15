import React, { useRef } from "react";
import { Link, useSubmit, useTransition } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { redirect, typedjson, useTypedActionData } from "remix-typedjson";

import Alert, { AlertType } from "~/components/common/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import Spinner from "~/components/spinner";
import Button from "~/components/common/button";
import { generateMagicLink, login } from "~/services/user.server";
import { getUser } from "~/services/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  // If there's already a user in the session, redirect to the home page
  return user ? redirect("/") : null;
};

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();

  const intent = formData.get("intent");

  const password = formData.get("password");
  const emailOrUsername = formData.get("emailOrUsername");

  if (typeof emailOrUsername !== "string") {
    return typedjson(
      {
        success: false,
        error: `Invalid Form Data`,
      },
      { status: 200 }
    );
  }

  if (intent === "magic") {
    return await generateMagicLink(emailOrUsername as string);
  }

  // todo: not happy repeating this for both password and email. Sort it
  if (typeof password !== "string" || typeof emailOrUsername !== "string") {
    return typedjson(
      {
        success: false,
        error: `Invalid Form Data`,
      },
      { status: 200 }
    );
  }
  return await login({
    email: emailOrUsername,
    password,
  });
}

export default function LoginRoute() {
  const emailInputRef = useRef<HTMLInputElement>(null);

  const actionData = useTypedActionData<typeof action>();
  const transition = useTransition();

  const submit = useSubmit();

  const handleMagicLinkClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const formData = new FormData();
    formData.append("intent", "magic");
    formData.append("emailOrUsername", emailInputRef.current?.value as string);
    submit(formData, { method: "post", replace: true });
  };

  return (
    <main className="flex h-screen flex-col flex-wrap content-center justify-center bg-gray-800 sm:bg-gray-700">
      <div className="mb-4 w-full max-w-md px-8 pt-6 pb-10 sm:border-2 sm:border-solid sm:border-gray-700 sm:bg-gray-800">
        <h1 className="pt-4 pb-8 text-center text-3xl font-bold">
          Log in to Brake Neck
        </h1>
        <Form
          className=""
          initialFormValues={{
            emailOrUsername: "",
            password: "",
          }}
          method="post"
        >
          {actionData?.error && (
            <Alert
              message="Invalid email, username or password"
              type={AlertType.ERROR}
            />
          )}
          {actionData?.success && (
            <Alert
              message={`A link has been sent to ${emailInputRef.current?.value}`}
              type={AlertType.INFO}
            />
          )}
          <FormField
            label="Email or username" // Could default label to input name with a capital letter?
            name="emailOrUsername"
            type="text"
            ref={emailInputRef}
            required
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            required
          />
          <div className="flex flex-col">
            <Button name="login" variant="primary">
              {transition.state !== "idle" ? <Spinner /> : "Log in"}
            </Button>
            <Link
              className="px-0 pb-2 font-semibold text-blue-500 hover:text-slate-500"
              to="/user/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>
        </Form>
        <Button
          className="my-1 w-full"
          name="magic"
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
