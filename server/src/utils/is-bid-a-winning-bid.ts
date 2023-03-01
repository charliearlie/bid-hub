import { Bid, Item } from '../entities';

export default function isBidAWinningBid(bid: Bid, item: Item): boolean {
  const { startingPrice, winningBid } = item;
  const { amount } = bid;

  if (!startingPrice) return false;
  const priceToBeat = winningBid ?? startingPrice;

  if (amount > priceToBeat) {
    return true;
  }

  return false;
}
