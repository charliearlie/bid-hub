import { gql } from "~/gql/util/gql-request";

export const LOGIN_USER = gql`
  mutation Login($emailOrUsername: String!, $password: String!) {
    login(emailOrUsername: $emailOrUsername, password: $password) {
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
      token
    }
  }
`;
