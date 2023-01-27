import { gql } from "~/gql/util/gql-request";

export const HANDLE_MAGIC_EMAIL_LOGIN = gql`
  mutation HandleMagicEmailLogin($loginToken: String!) {
    handleMagicEmailLogin(loginToken: $loginToken) {
      user {
        id
      }
      token
      success
    }
  }
`;
