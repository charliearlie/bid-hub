import { gql } from "~/gql/util/gql-request";
export const ITEM_BY_ID_QUERY = gql`
  query GetItemById($itemId: Float!) {
    getItemById(id: $itemId) {
      item {
        id
        name
        hasBiddingEnabled
        startingPrice
        winningBid
        formattedWinningBid
        bids {
          amount
        }
        condition
        categories {
          title
          id
        }
        formattedBuyItNowPrice
        formattedStartingPrice
        description
        bidCount
        imageUrl
        seller {
          username
        }
      }
      success
      errors {
        field
        message
      }
    }
  }
`;
