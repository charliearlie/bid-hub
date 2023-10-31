import type { Item, Listing } from "@prisma/client";
import { prisma } from "./prisma.server";
import { getUserById } from "./user.server";
import { generateSlug } from "~/util/utils";

export async function getAllListings() {
  return await prisma.listing.findMany();
}

export async function addListing(
  listing: Pick<
    Listing,
    | "description"
    | "title"
    | "quantity"
    | "buyItNowPrice"
    | "startingBid"
    | "minBidIncrement"
  >,
  item: Item,
  categoryIds: string[],
  userId: string
) {
  const user = await getUserById(userId);
  const newListing = await prisma.listing.create({
    data: {
      title: listing.title,
      description: listing.description,
      quantity: listing.quantity,
      buyItNowPrice: listing.buyItNowPrice,
      startingBid: listing.startingBid,
      minBidIncrement: listing.minBidIncrement,
      seller: {
        connect: {
          id: user?.id,
        },
      },
      item: {
        connect: {
          id: item.id,
        },
      },
      categories: {
        create: categoryIds.map((categoryId) => ({
          category: {
            connect: {
              id: categoryId,
            },
          },
        })),
      },
      slug: generateSlug(listing.title),
    },
  });

  return newListing;
}

export const getListingBySlug = async (slug: string) => {
  const item = await prisma.listing.findUnique({
    where: { slug },
    include: { item: true },
  });

  return item;
};

export const getListingsByCategory = async (categoryId: string) => {
  const listings = await prisma.listing.findMany({
    where: {
      categories: {
        some: {
          categoryId,
        },
      },
    },
  });

  return listings;
};

export const getCategoryDropdownOptions = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));
};
