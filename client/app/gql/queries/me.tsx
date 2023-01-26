import { gql } from "~/gql/util/gql-request";

export const ME_QUERY = gql`
  query Me {
    me {
      success
      user {
        username
        email
        avatarUrl
        firstName
        lastName
      }
    }
  }
`;
