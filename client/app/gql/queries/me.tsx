import { gql } from "~/util/gql-request";

const ME_QUERY = gql`
  query Me {
    me {
      success
      user {
        username
        email
        avatarUrl
      }
    }
  }
`;

export { ME_QUERY };
