import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, type DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Send } from "lucide-react";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { z } from "zod";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/common/ui/alert";
import { FormField } from "~/components/form/form-field";
import { SubmitButton } from "~/components/form/submit-button";

import { forgotPassword } from "~/services/user.server";

import { checkForHoneypot } from "~/util/honeypot.server";

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
  checkForHoneypot(formData);

  const submission = parseWithZod(formData, { schema: ForgotPasswordSchema });

  if (submission.status !== "success") {
    return json({ result: submission.reply(), status: "idle" } as const, {
      status: submission.status === "error" ? 400 : 200,
    });
  }

  const { email } = submission.value;

  const forgotPasswordResponse = await forgotPassword(email);
  if (!forgotPasswordResponse.success) {
    return json({
      result: submission.reply({
        formErrors: ["Something went wrong"],
        fieldErrors: {
          address: ["Email is invalid"],
        },
      }),
      status: "error",
    } as const);
  }

  return json({
    result: submission.reply({ resetForm: true }),
    status: submission.status,
  } as const);
};

export default function ForgotPasswordRoute() {
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "forgot-password-form",
    lastResult: actionData?.result,
    constraint: getZodConstraint(ForgotPasswordSchema),
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ForgotPasswordSchema });
    },
  });

  console.log("actionData", actionData?.result);

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
      <Form className="mb-4 pt-6" method="post" {...getFormProps(form)}>
        <FormField
          label="Email"
          errors={fields.email.errors}
          {...getInputProps(fields.email, { type: "email" })}
        />
        <HoneypotInputs />
        <div className="mt-2 flex justify-center">
          <SubmitButton className="w-full">
            <span className="flex gap-1">
              Send me a link <Send size={16} />
            </span>
          </SubmitButton>
        </div>
      </Form>
    </div>
  );
}
