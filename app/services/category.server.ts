import { prisma } from "~/util/prisma.server";

export const getCategoryAndParents = async (categoryId: string) => {
  const result = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
    include: {
      parentCategory: true,
    },
  });

  return result;
};

export const getHomepageCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      image: {
        not: null,
      },
    },
    select: {
      image: true,
      name: true,
      slug: true,
    },
  });

  return categories;
};
