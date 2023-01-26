import { gql } from "~/gql/util/gql-request";

export const EDIT_USER = gql`
  mutation EditUser($editedUserDetails: EditUserValidator!) {
    editUser(editedUserDetails: $editedUserDetails) {
      success
      user {
        id
        username
        lastName
        firstName
      }
      token
    }
  }
`;
