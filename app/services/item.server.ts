import { prisma } from "../util/prisma.server";

export const createItem = async (name: string) => {
  const newItem = await prisma.item.create({
    data: {
      name,
      description: "This is a description",
    },
  });
  return newItem;
};

export const getItemById = async (id: string) => {
  const item = await prisma.item.findUnique({
    where: {
      id,
    },
  });
  return item;
};
