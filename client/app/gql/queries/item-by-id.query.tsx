import { gql } from "~/gql/util/gql-request";
export const ITEM_BY_ID_QUERY = gql`
  query GetItemById($itemId: Float!) {
    getItemById(id: $itemId) {
      item {
        name
      }
      success
      errors {
        field
        message
      }
    }
  }
`;
