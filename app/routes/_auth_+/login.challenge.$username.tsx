import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
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
import { Button } from "~/components/common/ui/button";
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

  const submission = parseWithZod(formData, { schema: LoginChallengeSchema });

  if (submission.status !== "success") {
    return json(
      { result: submission.reply(), status: submission.status } as const,
      {
        status: submission.status === "error" ? 400 : 200,
      }
    );
  }

  let errorMessage = "Incorrect password";

  // Maybe return an error message from login? Or throw an error?
  const user = await login({
    password: submission.value.password,
    emailOrUsername: params.username!,
  });

  if (!user) {
    return json({
      result: submission.reply({ formErrors: [errorMessage] }),
      status: "error",
    } as const);
  }

  return createUserSession(user.id, submission.value.redirectTo);
}

export default function LoginIdentifierRoute() {
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "login-challenge-form",
    lastResult: actionData?.result,
    constraint: getZodConstraint(LoginChallengeSchema),
    shouldValidate: "onBlur",
    defaultValue: { redirectTo: "" },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginChallengeSchema });
    },
  });

  return (
    <div className="flex h-full flex-col gap-8">
      <h1 className="pb-2 text-center text-lg font-semibold">
        Welcome back {loaderData.username}
      </h1>
      {actionData?.status === "error" && (
        <Alert variant="destructive" className="my-2">
          <AlertTitle>{form.errors}</AlertTitle>
        </Alert>
      )}
      <Form className="flex flex-col" method="post" {...getFormProps(form)}>
        <FormField
          label="Password"
          errors={fields.password.errors}
          {...getInputProps(fields.password, { type: "password" })}
        />
        <input
          name="redirectTo"
          type="text"
          value={searchParams.get("redirectTo") || ""}
          readOnly
          hidden
        />
        <SubmitButton name="login" variant="default">
          Log in
        </SubmitButton>
      </Form>
      <Button asChild variant="outline">
        <Link
          className="px-0 pb-2 font-semibold text-accent-foreground hover:text-slate-500"
          to="/forgot-password"
        >
          Forgot your password?
        </Link>
      </Button>
    </div>
  );
}
