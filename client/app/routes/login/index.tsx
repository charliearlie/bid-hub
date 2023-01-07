import { gql, useMutation } from "@apollo/client";
import { Link, useActionData } from "@remix-run/react";
import { redirect } from "@remix-run/router";
import FormField from "~/components/form/form-field";
import Alert, { AlertType } from "~/components/alert";
import Spinner from "~/components/spinner";
import Form, { FormData } from "~/components/form/form";

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        username
        email
      }
      errors {
        field
        message
      }
      success
    }
  }
`;

export default function LoginRoute() {
  const [login, { error, data, loading }] = useMutation(LOGIN_USER);

  const submitForm = async (values: FormData) => {
    await login({ variables: values });
    redirect("/");
  };

  // This shouldn't be too important right now as the errors are handled on the server and returned in the data payload
  if (error) return <p>Error</p>;

  return (
    <main>
      <div className="flex flex-col flex-wrap content-center">
        <h1 className="text-center text-3xl font-bold">Log in to Bidhub</h1>
        <Form
          className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
          initialFormValues={{
            email: "",
            password: "",
          }}
          handleSubmit={submitForm}
        >
          {data?.login.success === false && (
            <Alert message="Invalid email or password" type={AlertType.ERROR} />
          )}
          <FormField
            label="Email" // Could default label to input name with a capital letter?
            name="email"
            type="text"
          />
          <FormField label="Password" name="password" type="password" />
          <div className="flex justify-between">
            <button className="w-20 rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
              {loading ? <Spinner /> : "Log in"}
            </button>
            <Link
              className="px-0 py-2 font-semibold text-blue-700 hover:text-slate-500"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
}
