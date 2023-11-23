import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { redirect, json, type DataFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { z } from "zod";

import { Alert, AlertTitle } from "~/components/common/ui/alert";
import { FormField } from "~/components/form/form-field";
import { SubmitButton } from "~/components/form/submit-button";

import { createUserSession } from "~/services/session.server";
import { getUserByUsernameOrEmail, login } from "~/services/user.server";

const LoginChallengeSchema = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  redirectTo: z.string().optional(),
});

export const meta = () => {
  return [
    { title: "Log in to Bidhub" },
    { name: "description", content: "Log in page for Bidhub" },
  ];
};

export const loader = async ({ params }: DataFunctionArgs) => {
  if (params.username) {
    const user = await getUserByUsernameOrEmail(params.username);

    if (!user) {
      return redirect("/login");
    }

    return json({ username: user.username });
  }
};

export async function action({ request, params }: DataFunctionArgs) {
  const formData = await request.formData();

  const submission = parse(formData, { schema: LoginChallengeSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ status: "idle", submission } as const);
  }

  let errorMessage = "Incorrect password";

  // Maybe return an error message from login? Or throw an error?
  const user = await login({
    password: submission.value.password,
    emailOrUsername: params.username!,
  });

  if (!user) {
    submission.error[""] = [errorMessage];
    return json({ status: "error", errorMessage, submission } as const);
  }

  return createUserSession(user.id, submission.value.redirectTo);
}

export default function LoginIdentifierRoute() {
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "login-challenge-form",
    lastSubmission: actionData?.submission,
    constraint: getFieldsetConstraint(LoginChallengeSchema),
    shouldValidate: "onBlur",
    defaultValue: { redirectTo: "" },
    onValidate({ formData }) {
      return parse(formData, { schema: LoginChallengeSchema });
    },
  });

  return (
    <div className="flex h-full flex-col gap-8">
      <h1 className="pb-2 text-center text-lg font-semibold">
        Welcome back {loaderData.username}
      </h1>
      {actionData?.status === "error" && (
        <Alert variant="destructive" className="my-2">
          <AlertTitle>{form.error}</AlertTitle>
        </Alert>
      )}
      <Form className="" method="post" {...form.props}>
        <FormField
          label="Password"
          errors={fields.password.errors}
          {...conform.input(fields.password, { type: "password" })}
        />
        <input
          name="redirectTo"
          type="text"
          value={searchParams.get("redirectTo") || ""}
          readOnly
          hidden
        />
        <div className="flex items-center justify-between">
          <Link
            className="px-0 pb-2 font-semibold text-accent-foreground hover:text-slate-500"
            to="/forgot-password"
          >
            Forgot your password?
          </Link>
          <SubmitButton name="login" variant="default">
            Log in
          </SubmitButton>
        </div>
      </Form>
    </div>
  );
}
