import { prisma } from "./prisma.server";

export async function createItem(name: string) {
  const newItem = await prisma.item.create({
    data: {
      name,
      description: "This is a description",
    },
  });
  return newItem;
}

export async function getItemById(id: string) {
  const item = await prisma.item.findUnique({
    where: {
      id,
    },
  });
  return item;
}
