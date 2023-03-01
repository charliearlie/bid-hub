import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { Bid, Item, User } from '../entities';
import { MyContext } from '../../types';
import { NotFoundError, wrap } from '@mikro-orm/core';
import BidHubResponse from './helpers/Response';
import isBidAWinningBid from '../utils/is-bid-a-winning-bid';

@ObjectType()
class BidResponse extends BidHubResponse {
  @Field(() => Bid, { nullable: true })
  bid?: Bid;
}

@Resolver(() => Bid)
class BidResolver {
  // List all bids (only for testing purposes)
  // Ensure the user ID has the correct permissions to access this data
  @Query(() => [Bid])
  async bids(@Ctx() { em }: MyContext): Promise<Bid[]> {
    return em.find(Bid, {});
  }

  // Place bid
  @Mutation(() => BidResponse)
  async placeBid(
    @Ctx() { em, req }: MyContext,
    @Arg('itemId') itemId: number,
    @Arg('amount') amount: number
  ): Promise<BidResponse> {
    if (req.session.userId) {
      try {
        const item = await em.findOneOrFail(Item, { id: itemId });
        const user = await em.findOneOrFail(User, { id: req.session.userId });
        const bid = await em.create(Bid, {
          amount,
          item,
          user,
        });

        if (isBidAWinningBid(bid, item)) {
          const toSave = wrap(item).assign({
            winningBid: amount,
          });
          await em.persistAndFlush(bid);
          await em.persistAndFlush(toSave);

          return { bid, success: true };
        }
        return { bid, success: false };
      } catch (error) {
        if (error instanceof NotFoundError) {
          return {
            errors: [
              {
                field: 'item',
                message: 'item not found',
              },
            ],
            success: false,
          };
        }
      }
    }

    return {
      errors: [
        {
          field: 'user',
          message: 'User is not logged in',
        },
      ],
      success: false,
    };
  }
}

export default BidResolver;
