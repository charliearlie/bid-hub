import { gql } from "~/util/gql-request";

const ME_QUERY = gql`
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

export { ME_QUERY };
