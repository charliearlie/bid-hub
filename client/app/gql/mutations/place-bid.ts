import { gql } from "~/gql/util/gql-request";

export const PLACE_BID = gql`
  mutation PlaceBid($itemId: Float!, $amount: Float!) {
    placeBid(itemId: $itemId, amount: $amount) {
      bid {
        id
        amount
        status
      }
      success
    }
  }
`;
