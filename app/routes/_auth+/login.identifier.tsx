import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { redirect, json, type DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { ArrowRight, Send } from "lucide-react";
import { z } from "zod";

import {
  generateMagicLink,
  getUserByUsernameOrEmail,
} from "~/services/user.server";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/common/ui/alert";
import FormField from "~/components/form/form-field";
import { SubmitButton } from "~/components/form/submit-button";

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
    <div>
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
        <div className="flex flex-col gap-4">
          <SubmitButton name={conform.INTENT} value="submit" variant="default">
            Next {<ArrowRight size={16} />}
          </SubmitButton>
          <SubmitButton name={conform.INTENT} value="magic" variant="secondary">
            Send magic link {<Send size={16} />}
          </SubmitButton>
          {/* <Link
            className="px-0 pb-2 font-semibold text-accent-foreground hover:text-slate-500"
            to="/forgot-password"
          >
            Forgot your username or email?
          </Link> */}
        </div>
      </Form>
    </div>
  );
}
