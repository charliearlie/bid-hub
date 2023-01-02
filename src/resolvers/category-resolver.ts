import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import { MyContext } from '../../types';
import { Category } from '../entities';
import CategoryValidator from '../contracts/validators/category.validator';

@Resolver(() => Category)
class CategoryResolver {
  // Get all categories
  @Query(() => [Category])
  async categories(@Ctx() { em }: MyContext): Promise<Category[]> {
    return em.find(Category, {});
  }

  // Get category by ID
  @Query(() => Category)
  async getCatgoryById(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number
  ): Promise<Category | null> {
    const category = await em.findOne(Category, { id });

    return category;
  }

  // Create category
  @Mutation(() => Category)
  async addCategory(
    @Ctx() { em }: MyContext,
    @Arg('categoryInput') categoryInput: CategoryValidator
  ): Promise<Category> {
    const newCategory = await em.create(Category, {
      ...categoryInput,
    });

    return newCategory;
  }

  // Edit item

  // Delete item
  @Mutation(() => Boolean)
  async deleteCategory(
    @Ctx() { em }: MyContext,
    @Arg('id', () => ID) id: number
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Category, id);
    } catch (error) {
      console.error('Something goofed when deleting');
    }
    return true;
  }
}

export default CategoryResolver;
