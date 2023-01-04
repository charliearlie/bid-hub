import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";

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
    <div>
      <h3>Login</h3>
      <form onSubmit={submitForm}>
        <div>
          <label>
            Email: <input onChange={handleChange} type="text" name="email" />
          </label>
        </div>
        <div>
          <label>
            Password:{" "}
            <input onChange={handleChange} type="password" name="password" />
          </label>
        </div>
        <div>
          <button className="button">Login</button>
        </div>
      </form>
      {data && JSON.stringify(data)}
    </div>
  );
}
