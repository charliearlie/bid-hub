import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { type DataFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { z } from "zod";

import { Alert, AlertTitle } from "~/components/common/ui/alert";
import { FormField } from "~/components/form/form-field";
import { SubmitButton } from "~/components/form/submit-button";

import { createUserSession } from "~/services/session.server";
import { checkAvailability, createUser } from "~/services/user.server";
import { UserUsernameFieldSchema } from "~/services/zod-schemas";

import { checkForHoneypot } from "~/util/honeypot.server";

export const meta = () => {
  return [{ title: "Register for Bidhub" }];
};

const RegisterFormSchema = z.object({
  email: z.string().email({ message: "Email must be a valid email address" }),
  username: UserUsernameFieldSchema,
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),
});

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  checkForHoneypot(formData);
  const submission = await parseWithZod(formData, {
    schema: RegisterFormSchema.superRefine(async (data, ctx) => {
      const availabilityCheck = await checkAvailability(
        data.email,
        data.username
      );

      if (!availabilityCheck.available) {
        if (!availabilityCheck.properties.email) {
          ctx.addIssue({
            path: ["email"],
            code: z.ZodIssueCode.custom,
            message: "A user already exists with this email",
          });
        }
        if (!availabilityCheck.properties.username) {
          ctx.addIssue({
            path: ["username"],
            code: z.ZodIssueCode.custom,
            message: "A user already exists with this username",
          });
        }
        return;
      }
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return json(
      { result: submission.reply(), status: "submission.status" },
      {
        status: submission.status === "error" ? 400 : 200,
      }
    );
  }

  const newUser = await createUser(submission.value);

  if (!newUser) {
    return json({
      result: submission.reply({
        formErrors: ["Something went wrong"],
      }),
      status: "error",
    } as const);
  }
  return createUserSession(newUser.id);
}

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "register-form",
    lastResult: actionData?.result,
    constraint: getZodConstraint(RegisterFormSchema),
    shouldValidate: "onBlur",
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: RegisterFormSchema });
    },
  });

  return (
    <div className="flex h-full flex-col gap-8">
      <h1 className="text-center text-2xl font-bold">Sign up to Bidhub</h1>
      <Form className="flex flex-col" method="post" {...getFormProps(form)}>
        {actionData?.status === "error" && (
          <Alert variant="destructive">
            <AlertTitle>{form.errors}</AlertTitle>
          </Alert>
        )}
        <FormField
          label="Username"
          name="username"
          type="text"
          errors={fields.username.errors}
        />
        <FormField
          label="Email"
          name="email"
          type="text"
          errors={fields.email.errors}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          errors={fields.password.errors}
        />
        <HoneypotInputs />
        <SubmitButton className="w-25" variant="default">
          Sign up
        </SubmitButton>
      </Form>
    </div>
  );
}
