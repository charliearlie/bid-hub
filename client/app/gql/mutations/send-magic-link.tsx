import { gql } from "~/gql/util/gql-request";

export const SEND_MAGIC_LINK = gql`
  mutation EmailMagicLink($email: String!) {
    emailMagicLink(email: $email)
  }
`;
