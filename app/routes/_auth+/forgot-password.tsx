import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, type DataFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { Send } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/common/ui/alert";
import FormField from "~/components/form/form-field";
import Spinner from "~/components/spinner";
import { Button } from "~/components/common/ui/button";
import { forgotPassword } from "~/services/user.server";

const ForgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Email must be a valid email address" }),
});

export const meta = () => {
  return [{ title: "Forgot Password" }];
};

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();

  const submission = parse(formData, { schema: ForgotPasswordSchema });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }

  if (!submission.value) {
    return json({ status: "error", submission } as const, {
      status: 400,
    });
  }

  const { email } = submission.value;

  const forgotPasswordResponse = await forgotPassword(submission.value.email);

  return json({
    status: !forgotPasswordResponse.success ? "error" : "success",
    submission,
    email,
    error: forgotPasswordResponse.error,
  } as const);
};

export default function ForgotPasswordRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [form, fields] = useForm({
    id: "forgot-password-form",
    lastSubmission: actionData?.submission,
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: ForgotPasswordSchema });
    },
  });

  return (
    <div>
      <h2 className="pt-4 text-center text-3xl font-bold">Reset password</h2>
      <p className="pb-2 text-center">
        Enter your email address to be sent a reset token
      </p>
      {actionData?.status === "success" && (
        <Alert className="my-2">
          <AlertTitle>Reset your password</AlertTitle>
          <AlertDescription>
            A reset token has been sent to your email address
          </AlertDescription>
        </Alert>
      )}
      {actionData?.status === "error" && (
        <Alert variant="destructive" className="my-2">
          <AlertTitle>User not found</AlertTitle>
          <AlertDescription>
            We couldn't find your account to send you a reset token
          </AlertDescription>
        </Alert>
      )}
      <Form className="mb-4 pt-6" method="post" {...form.props} >
        <FormField
          label="Email"
          name="email"
          type="text"
          errors={fields.email.errors}
        />
        <div className="mt-2 flex justify-center">
          <Button className="w-full">
            {navigation.state !== "idle" ? (
              <Spinner />
            ) : (
              <span className="flex gap-1">
                Send me a link <Send size={16} />
              </span>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
