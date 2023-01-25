import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import {
  ActionArgs,
  ActionFunction,
  DataFunctionArgs,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { getUserIdFromSession } from "~/session.server";
import Alert, { AlertType } from "~/components/alert";
import Form from "~/components/form/form";
import FormField from "~/components/form/form-field";
import Spinner from "~/components/spinner";
import { gql, requestWithCredentials } from "~/util/gql-request";
import { ME_QUERY } from "~/gql/queries/me";
import { UserValidator as User } from "~/gql/graphql";

const EDIT_USER = gql`
  mutation ResetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token) {
      success
      user {
        id
      }
      token
    }
  }
`;

type ActionData =
  | { password: null | string; confirmPassword: null | string }
  | undefined;

export const action: ActionFunction = async ({
  params,
  request,
}: ActionArgs) => {
  const formData = await request.formData();

  const userId = await getUserIdFromSession(request);

  //   const password = formData.get("password");
  //   const confirmPassword = formData.get("confirmPassword");

  //   const errors: ActionData = {
  //     password: password ? null : "Password is required",
  //     confirmPassword: confirmPassword ? null : "Please confirm your password",
  //   };

  //   const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  //   if (hasErrors) {
  //     return json<ActionData>(errors);
  //   }

  //   const response = await requestClient.request(EDIT_USER, {
  //     newPassword: password,
  //     token: params.token,
  //   });

  return json(true);
};

type LoaderData = {
  success: boolean;
  user: User; // I believe this will have to exist because we will redirect if there is no user data
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const response = await requestWithCredentials(ME_QUERY, request);

  const { me } = response;

  if (me) {
    return json<LoaderData>(me);
  }

  return redirect("/");
};

export default function ForgotPasswordRoute() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const transition = useTransition();
  const { success, user } = loaderData;
  if (success) {
    return (
      <main>
        <div className="flex flex-col flex-wrap content-center">
          <h1 className="text-center text-3xl font-bold">Edit user</h1>
          <p className="text-center">Edit the things about you</p>
          {/* We should add a link to go back to requesting a reset link */}
          {actionData && (
            <Alert type={AlertType.ERROR} message="Something went wrong" />
          )}
          <Form
            className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
            initialFormValues={user}
            method="post"
          >
            <FormField label="Username" name="username" type="text" />
            <FormField label="Password" name="password" type="password" />
            <FormField
              label="Confirm password"
              name="confirmPassword"
              type="password"
            />
            <FormField label="First name" name="firstName" type="text" />
            <FormField label="Last name" name="lastName" type="text" />
            <div className="flex justify-center">
              <button className="w-25 rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
                {transition.state !== "idle" ? <Spinner /> : "Update user"}
              </button>
            </div>
          </Form>
        </div>
      </main>
    );
  }
}
