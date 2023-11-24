import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { redirect, json, type DataFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { ArrowRight, Send } from "lucide-react";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { z } from "zod";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/common/ui/alert";
import { Button } from "~/components/common/ui/button";
import { FormField } from "~/components/form/form-field";
import { SubmitButton } from "~/components/form/submit-button";

import {
  generateMagicLink,
  getUserByUsernameOrEmail,
} from "~/services/user.server";

import { checkForHoneypot } from "~/util/honeypot.server";

const LoginIdentifierSchema = z.object({
  emailOrUsername: z.string({
    required_error: "Email or username is required",
  }),
  redirectTo: z.string().optional(),
});

export const meta = () => {
  return [
    { title: "Log in to Bidhub" },
    { name: "description", content: "Log in page for Bidhub" },
  ];
};

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  checkForHoneypot(formData);

  const submission = parse(formData, { schema: LoginIdentifierSchema });

  if (submission.intent === "magic" && submission.value) {
    const emailReceipt = await generateMagicLink(
      submission.value.emailOrUsername
    );
    if (emailReceipt?.success) {
      return json({
        status: "success",
        submission,
        email: emailReceipt.email,
      } as const);
    }
    return json({ status: "error", submission } as const);
  }

  if (submission.intent !== "submit" || !submission.value) {
    return json({ status: "idle", submission } as const);
  }

  const user = await getUserByUsernameOrEmail(submission.value.emailOrUsername);
  if (!user) {
    return json({ status: "error", submission } as const);
  }
  return redirect(`/login/challenge/${user.username}`);
}

export default function LoginIdentifierRoute() {
  const [searchParams] = useSearchParams();

  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "login-identifier-form",
    lastSubmission: actionData?.submission,
    shouldValidate: "onBlur",
    constraint: getFieldsetConstraint(LoginIdentifierSchema),
    defaultValue: { redirectTo: "" },
    onValidate({ formData }) {
      return parse(formData, { schema: LoginIdentifierSchema });
    },
  });

  return (
    <div className="flex h-full flex-col gap-8">
      {actionData?.status === "error" && (
        <Alert variant="destructive" className="my-2">
          <AlertTitle>User not found</AlertTitle>
          <AlertDescription>
            No user matches that email or username
          </AlertDescription>
        </Alert>
      )}
      {actionData?.status === "success" && (
        <Alert className="my-2">
          <AlertTitle>Token sent</AlertTitle>
          <AlertDescription>
            A token has been sent to {actionData.email}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="flex text-xl sm:text-2xl">
          Enter your email or username to log in to Bidhub
        </h1>
        <p>
          Or{" "}
          <Link className="text-primary" to="/register">
            sign up
          </Link>{" "}
          to buy some good shit
        </p>
      </div>
      <Form className="" method="post" {...form.props}>
        <FormField
          label="Email or username"
          errors={fields.emailOrUsername.errors}
          {...conform.input(fields.emailOrUsername)}
        />
        <input
          name="redirectTo"
          type="text"
          value={searchParams.get("redirectTo") || ""}
          readOnly
          hidden
        />
        <HoneypotInputs />
        <div className="flex flex-col gap-4">
          <SubmitButton name={conform.INTENT} value="submit" variant="default">
            Next {<ArrowRight size={16} />}
          </SubmitButton>
          <SubmitButton
            className="bg-green-800"
            name={conform.INTENT}
            value="magic"
            variant="secondary"
          >
            Send magic link {<Send size={16} />}
          </SubmitButton>
          <Button asChild variant="outline">
            <Link
              className="px-0 pb-2 font-semibold text-accent-foreground hover:text-slate-500"
              to="/forgot-password"
            >
              Forgot your username or email?
            </Link>
          </Button>
        </div>
      </Form>
    </div>
  );
}
