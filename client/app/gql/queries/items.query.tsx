import { gql } from "~/gql/util/gql-request";

export const ITEMS_QUERY = gql`
  query Items {
    items {
      id
      name
      description
      imageUrl
      seller {
        username
      }
      condition
      categories {
        title
      }
      slug
      buyItNowPrice
      winningBid
      formattedBuyItNowPrice
      formattedWinningBid
      hasBiddingEnabled
    }
  }
`;
