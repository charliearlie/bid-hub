import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import ItemValidator from '../contracts/validators/item.validator';
import { Item } from '../entities/Item';
import { MyContext } from '../../types';
import { toKebabCase } from '../utils';
import { User } from '../entities/User';
import { Category } from '../entities/Category';

@Resolver(() => Item)
class ItemResolver {
  // Get all items
  @Query(() => [Item])
  async items(@Ctx() { em }: MyContext): Promise<Item[]> {
    return em.find(Item, {});
  }

  // Get item by ID
  @Query(() => Item)
  async getItemById(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number
  ): Promise<Item | null> {
    console.log({ id });
    const item = await em.findOne(Item, { id });

    return item;
  }

  // Search for items
  @Query(() => [Item])
  async searchItems(
    @Ctx() { em }: MyContext,
    @Arg('searchExpression') searchExpression: string
  ): Promise<Item[]> {
    const items = await em.find(Item, {});

    // Basic now. This will be a fuzzy search that goes through more than the item name
    const matchedItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchExpression)
    );

    return matchedItems;
  }
  // Create item
  @Mutation(() => Item)
  async addItem(
    @Ctx() { em }: MyContext,
    @Arg('itemInput') itemInput: ItemValidator,
    @Arg('userId') userId: number
  ): Promise<Item> {
    const { categories: categoryIds } = itemInput;
    let categories: Category[] = [];

    if (categoryIds && categoryIds.length > 0) {
      categories = await em.find(Category, categoryIds);
    }

    const itemSeller = await em.findOneOrFail(User, { id: userId });
    const newItem = await em.create(Item, {
      ...itemInput,
      slug: toKebabCase(itemInput.name),
      seller: itemSeller,
      condition: itemInput.condition,
      categories,
    });

    return newItem;
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

    console.log(categoryIds);
    const itemToEdit = await em.findOneOrFail(Item, id);
    const categories = await em.find(Category, categoryIds);

    itemToEdit.name = name;
    itemToEdit.description = description;
    itemToEdit.imageUrl = imageUrl;
    itemToEdit.buyItNowPrice = price;

    const updateResult = await em.nativeUpdate(
      Item,
      { id },
      {
        name: itemInput.name,
        description: itemInput.description,
        condition: itemInput.condition,
      }
    );

    if (updateResult !== 1) {
      throw new Error('Could not update item');

    return itemToEdit;
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
