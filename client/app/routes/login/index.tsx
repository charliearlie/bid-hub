import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import FormField from "~/components/form/form-field";

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        username
        firstName
        lastName
        email
        password
        avatarUrl
        createdAt
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;
export default function LoginRoute() {
  const [login, { error, data, loading }] = useMutation(LOGIN_USER);
  const [formState, setFormState] = useState<any>({
    email: "",
    password: "",
  });

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    await login({ variables: formState });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  if (error) return <p>Error</p>;

  return (
    <main>
      <div className="flex flex-col flex-wrap content-center">
        <h1 className="text-center text-3xl font-bold">Log in to Bidhub</h1>
        <form
          className="mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 sm:shadow-md"
          onSubmit={submitForm}
        >
          <FormField
            handleChange={handleChange}
            label="Email"
            type="text"
            name="email"
          />
          <FormField
            handleChange={handleChange}
            label="Password"
            name="password"
            type="password"
          />
          <div className="flex justify-between">
            <button className="rounded bg-violet-700 px-4 py-2 text-lg font-semibold text-white hover:bg-violet-900">
              Log in
            </button>
            <button className="rounded px-0 py-2 font-semibold text-black">
              Forgot password?
            </button>
          </div>
        </form>
        {data && JSON.stringify(data)}
      </div>
    </main>
  );
}
