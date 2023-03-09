import React, { useRef } from "react";
import { Link, useActionData, useTransition } from "@remix-run/react";
import {
  ActionArgs,
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import Spinner from "~/components/spinner";
import Button from "~/components/button";
import { login } from "~/services/user.server";
import { getUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  // If there's already a user in the session, redirect to the home page
  return user ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const password = formData.get("password");
  const emailOrUsername = formData.get("emailOrUsername");

  if (typeof password !== "string" || typeof emailOrUsername !== "string") {
    return json(
      { success: false, error: `Invalid Form Data`, form: action },
      { status: 400 }
    );
  }

  return await login({ email: emailOrUsername, password });
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
    //todo: magic link functionality
    // if (userEmail) {
    //   await requestClient.request(SEND_MAGIC_LINK, {
    //     email: userEmail,
    //   });
    // }
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
