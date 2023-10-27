import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SubmitButton } from "~/components/form/submit-button";
import { requireUserId } from "~/services/session.server";
import { invariantResponse, useFocusInvalidForm } from "~/util/utils";
import FormField from "~/components/form/form-field";
import { useRef } from "react";

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUserId(request);

  return json({ loggedIn: true });
};

type ActionErrors = {
  formErrors: Array<string>;
  fieldErrors: {
    model: Array<string>;
    title: Array<string>;
  };
};

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const content = formData.get("model");

  const errors: ActionErrors = {
    formErrors: [],
    fieldErrors: {
      model: [],
      title: [],
    },
  };

  invariantResponse(typeof title === "string", "Title must be a string");
  invariantResponse(typeof content === "string", "Model must be a string");

  if (title === "") {
    errors.fieldErrors.title.push("Title is required");
  }

  if (title.length > 10) {
    errors.fieldErrors.title.push("Title must be less than 100 characters");
  }

  if (content === "") {
    errors.fieldErrors.model.push("Model is required");
  }

  if (content.length > 100) {
    errors.fieldErrors.model.push("Model must be less than 100 characters");
  }

  const hasErrors =
    errors.formErrors.length ||
    Object.values(errors.fieldErrors).some((fieldErrors) => fieldErrors.length);
  if (hasErrors) {
    return json({ errors, status: "error" } as const, { status: 400 });
  }

  return redirect("/");
};

export default function AddCarRoute() {
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);

  const fieldErrors =
    actionData?.status === "error" ? actionData.errors.fieldErrors : null;

  useFocusInvalidForm(formRef.current, actionData?.status === "error");

  return (
    <div className="container mx-auto p-4">
      <Form
        className="container mx-auto flex max-w-lg flex-col gap-2"
        method="post"
        ref={formRef}
      >
        <FormField
          label="Title"
          name="title"
          type="text"
          maxLength={100}
          required
          autoFocus
          errors={fieldErrors?.title}
        />
        <FormField
          label="Model"
          name="model"
          type="text"
          maxLength={100}
          required
          errors={fieldErrors?.model}
        />
        <SubmitButton>Submit</SubmitButton>
      </Form>
    </div>
  );
}
