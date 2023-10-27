import { Form, Link, useActionData } from "@remix-run/react";
import { type DataFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";

import { Alert, AlertTitle } from "~/components/common/ui/alert";
import FormField from "~/components/form/form-field";
import { checkAvailability, createUser } from "~/services/user.server";
import { createUserSession } from "~/services/session.server";
import { SubmitButton } from "~/components/form/submit-button";

export const meta = () => {
  return [{ title: "Register for Brake Neck" }];
};

const RegisterFormSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Email must be a valid email address" }),
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),
});

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, {
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

  if (submission.intent !== "submit" || !submission.value) {
    return json({ status: "idle", submission } as const);
  }

  const newUser = await createUser(submission.value);

  if (!newUser) {
    return json(
      {
        status: "error",
        submission,
        error: "Something went wrong",
      } as const,
      { status: 500 }
    );
  }
  return createUserSession(newUser.id);
}

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "register-form",
    lastSubmission: actionData?.submission,
    constraint: getFieldsetConstraint(RegisterFormSchema),
    shouldValidate: "onBlur",
    onValidate: ({ formData }) => {
      return parse(formData, { schema: RegisterFormSchema });
    },
  });
  return (
    <div>
      <h2 className="pt-4 pb-8 text-center text-3xl font-bold">
        Join Brake Neck
      </h2>
      <Form className="" method="post" {...form.props}>
        {actionData?.status === "error" && (
          <Alert variant="destructive">
            <AlertTitle>{actionData?.error}</AlertTitle>
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
        <div className="flex justify-between">
          <SubmitButton className="w-25" variant="default">
            Sign up
          </SubmitButton>
          <Link
            className="px-0 py-2 font-semibold text-accent-foreground hover:text-slate-500"
            to="/login"
          >
            Already registered?
          </Link>
        </div>
      </Form>
    </div>
  );
}
