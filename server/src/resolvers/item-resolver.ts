import {
  Arg,
  Ctx,
  Field,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { NotFoundError, wrap } from '@mikro-orm/core';
import ItemValidator from '../contracts/validators/item.validator';
import { Category, Item, User } from '../entities';
import { MyContext } from '../../types';
import { createSlug } from '../utils';
import BidHubResponse from './helpers/Response';

@ObjectType()
class ItemResponse extends BidHubResponse {
  @Field(() => Item, { nullable: true })
  item?: Item;
}

@Resolver(() => Item)
class ItemResolver {
  // Get all items
  @Query(() => [Item])
  async items(@Ctx() { em }: MyContext): Promise<Item[]> {
    const items = await em.find(Item, {});
    items.forEach(async (item) => {
      await wrap(item.bids).init();
    });
    return items;
  }

  // Get item by ID
  @Query(() => ItemResponse)
  async getItemById(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number
  ): Promise<ItemResponse> {
    let item;
    try {
      item = await em.findOneOrFail(Item, { id });
      await wrap(item.bids).init();
      await wrap(item.bidCount).init();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return {
          errors: [
            {
              field: 'item',
              message: `No item was found with an ID of ${id}`,
            },
          ],
          success: false,
        };
      }
    }

    await item?.bids?.init();

    return { item, success: true };
  }

  // Search for items
  @Query(() => [Item])
  async searchItems(
    @Ctx() { em }: MyContext,
    @Arg('searchQuery') searchQuery: string
  ): Promise<Item[]> {
    const items = await em.find(Item, { name: { $ilike: `%${searchQuery}%` } });

    return items;
  }
  // Create item
  @Mutation(() => ItemResponse)
  async addItem(
    @Ctx() { em }: MyContext,
    @Arg('itemInput') itemInput: ItemValidator,
    @Arg('userId') userId: number
  ): Promise<ItemResponse> {
    const { categories: categoryIds } = itemInput;
    let categories: Category[] = [];

    try {
      if (categoryIds && categoryIds.length > 0) {
        categories = await em.find(Category, categoryIds);
      }

      const itemSeller = await em.findOneOrFail(User, { id: userId });
      const newItem = await em.create(Item, {
        ...itemInput,
        slug: createSlug(itemInput.name),
        seller: itemSeller,
        condition: itemInput.condition,
        categories,
      });

      await em.persistAndFlush(newItem);
      return { item: newItem, success: true };
    } catch (error) {
      return {
        errors: [
          {
            field: 'item',
            message: 'Could not update item',
          },
        ],
        success: false,
      };
    }
  }

  // Edit item
  @Mutation(() => Item)
  async editItem(
    @Ctx() { em }: MyContext,
    @Arg('id', () => ID) id: number,
    @Arg('itemInput') itemInput: ItemValidator
  ): Promise<Item | null> {
    const {
      name,
      description,
      imageUrl,
      price,
      categories: categoryIds,
    } = itemInput;

    const existingItem = await em.findOneOrFail(Item, id);
    const categories = await em.find(Category, categoryIds);

    const toSave = wrap(existingItem).assign({
      name,
      description,
      imageUrl,
      buyItNowPrice: price,
      categories,
    });

    await em.persistAndFlush(toSave);

    return toSave;
  }

  // Delete item
  @Mutation(() => Boolean)
  async deleteItem(
    @Ctx() { em }: MyContext,
    @Arg('id', () => ID) id: number
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Item, id);
    } catch (error) {
      console.error('Something goofed when deleting');
    }
    return true;
  }
}

export default ItemResolver;
