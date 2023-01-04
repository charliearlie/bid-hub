import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";

const REGISTER_USER = gql`
  mutation Register($email: String!, $password: String!, $username: String!) {
    register(
      userInput: { email: $email, password: $password, username: $username }
    ) {
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
export default function RegisterRoute() {
  const [register, { error, data, loading }] = useMutation(REGISTER_USER);
  const [formState, setFormState] = useState<any>({
    email: "",
    password: "",
    username: "",
  });

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    await register({ variables: formState });
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
      <h3>Register</h3>
      <form onSubmit={submitForm}>
        <div>
          <label>
            Username:{" "}
            <input onChange={handleChange} type="text" name="username" />
          </label>
        </div>
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
          <button className="button">Register</button>
        </div>
      </form>
      {data && JSON.stringify(data)}
    </div>
  );
}
