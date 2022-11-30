import { Resolver, Query, Ctx } from 'type-graphql';
import { Item } from '../entities/Item';
import { MyContext } from '../../types';

@Resolver(() => Item)
export class ItemResolver {
  @Query(() => [Item])
  async posts(@Ctx() { em }: MyContext): Promise<Item[]> {
    console.log(em);
    return em.find(Item, {});
  }
}
