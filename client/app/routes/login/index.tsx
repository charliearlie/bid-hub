import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import FormField from "~/components/form/form-field";

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
    }
  }
`;

type LoginStateType = {
  email: string;
  password: string;
};

export default function LoginRoute() {
  const [login, { error, data, loading }] = useMutation(LOGIN_USER);
  const [formState, setFormState] = useState<LoginStateType>({
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

  const Spinner = () => {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="mr-2 inline h-8 w-8 animate-spin fill-purple-600 text-gray-200 "
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
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
            label="Email" // Could default label to input name with a capital letter?
            name="email"
            type="text"
          />
          <FormField
            handleChange={handleChange}
            label="Password"
            name="password"
            type="password"
          />
          <div className="flex justify-between">
            <button className="w-20 rounded bg-violet-700 px-3 py-2 text-lg font-semibold text-white hover:bg-violet-900">
              {loading ? <Spinner /> : "Log in"}
            </button>
            <button className="rounded px-0 py-2 font-semibold text-blue-700 hover:text-slate-500">
              Forgot password?
            </button>
          </div>
        </form>
        {data && JSON.stringify(data)}
      </div>
    </main>
  );
}
