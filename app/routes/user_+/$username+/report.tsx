import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { ReportType } from "@prisma/client";
import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { z } from "zod";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/common/ui/alert";
import { Button } from "~/components/common/ui/button";
import { FormField } from "~/components/form/form-field";
import { FormFieldTextArea } from "~/components/form/form-field-text-area";

import { getUserId } from "~/services/session.server";
import { getUserByUsernameOrEmail, reportUser } from "~/services/user.server";

const ReportSchema = z.object({
  description: z.string({
    required_error: "Please provide a report",
  }),
  type: z.nativeEnum(ReportType),
});

export async function action({ params, request }: DataFunctionArgs) {
  invariant(params.username, "No username provided");
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: ReportSchema });

  if (submission.status !== "success") {
    return json(
      { result: submission.reply(), status: submission.status } as const,
      {
        status: submission.status === "error" ? 400 : 200,
      }
    );
  }

  const user = await getUserByUsernameOrEmail(params.username);
  const currentUserId = await getUserId(request);
  if (!user) {
    return json({
      result: submission.reply({ formErrors: ["This user no longer exists"] }),
      status: "error",
    } as const);
  } else if (!currentUserId) {
    return json({
      result: submission.reply({
        formErrors: ["You must be logged in to report a user"],
      }),
      status: "error",
    });
  }

  await reportUser(
    user.id,
    currentUserId,
    submission.value.description,
    submission.value.type
  );

  return redirect(`/user/${user.username}`);
}

export default function ReportUserRoute() {
  const actionData = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "report-user-form",
    lastResult: actionData?.result,
    shouldValidate: "onBlur",
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: ReportSchema });
    },
    constraint: getZodConstraint(ReportSchema),
  });

  return (
    <main className="container mx-auto max-w-5xl p-4">
      <h1 className="py-4">Report User</h1>
      {actionData?.status === "error" && (
        <Alert variant="destructive" className="my-2">
          <AlertTitle>User not found</AlertTitle>
          <AlertDescription>
            {form.errors ?? "Something went wrong"}
          </AlertDescription>
        </Alert>
      )}
      <Form
        {...getFormProps(form)}
        method="post"
        className="flex flex-col gap-4"
      >
        <FormField
          label="Report Type"
          errors={fields.type.errors}
          {...getInputProps(fields.type, { type: "text" })}
        />
        <FormFieldTextArea
          label="Description"
          errors={fields.description.errors}
          {...getInputProps(fields.description, { type: "text" })}
          rows={10}
        />
        <div className="flex sm:justify-end">
          <Button className="w-full sm:w-auto" type="submit">
            Report user
          </Button>
        </div>
      </Form>
    </main>
  );
}
