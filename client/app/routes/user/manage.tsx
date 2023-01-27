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
import { requestWithCredentials } from "~/gql/util/gql-request";
import { ME_QUERY } from "~/gql/queries";
import { UserValidator as User } from "~/gql/graphql";
import { EDIT_USER } from "~/gql/mutations/edit-user";

// todo: Move this into own file or make more generic and just look for a key value pair of strings
type ActionData = {
  username: null | string;
  avatarUrl: null | string;
  firstName: null | string;
  lastName: null | string;
};

type LoaderData = {
  success: boolean;
  user: User; // I believe this will have to exist because we will redirect if there is no user data
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const avatarUrl = formData.get("avatarUrl");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const username = formData.get("username");

  const errors: ActionData = {
    firstName: null, // todo: Do some validation to ensure this is a valid first name
    lastName: null, // Same as above but we must ensure that the user can save without adding their name
    avatarUrl: null, // Same
    username: null, // again same
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  const editedUserDetails = {
    avatarUrl,
    firstName,
    lastName,
    username,
  };

  const response = await requestWithCredentials(EDIT_USER, request, {
    editedUserDetails,
  });

  console.log(response);

  return json(true);
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const response = await requestWithCredentials(ME_QUERY, request);

  const { me } = response;

  if (me) {
    return json<LoaderData>(me);
  }

  return redirect("/");
};

export default function ManageUserRoute() {
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
            className="mb-4 w-full rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
            initialFormValues={user}
            method="post"
          >
            <FormField label="Username" labelLeft name="username" type="text" />
            <FormField
              label="Password"
              labelLeft
              name="password"
              type="password"
            />
            <FormField
              label="Confirm password"
              labelLeft
              name="confirmPassword"
              type="password"
            />
            <FormField
              label="First name"
              labelLeft
              name="firstName"
              type="text"
            />
            <FormField
              label="Last name"
              labelLeft
              name="lastName"
              type="text"
            />
            <div className="flex justify-center">
              <button className="w-25 rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
                {transition.state !== "idle" ? <Spinner /> : "Update"}
              </button>
            </div>
          </Form>
          <button onClick={() => console.log("button clicked")}>Hello</button>
        </div>
      </main>
    );
  }
}
