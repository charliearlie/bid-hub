import type { Item, Listing } from "@prisma/client";
import { prisma } from "../util/prisma.server";
import { getUserById } from "./user.server";
import { buildListingEndDateAndTime, generateSlug } from "~/util/utils";

export async function getAllListings() {
  return await prisma.listing.findMany();
}

type ListingSubSet = Pick<
  Listing,
  | "description"
  | "title"
  | "quantity"
  | "buyItNowPrice"
  | "startingBid"
  | "minBidIncrement"
  | "images"
> & { endTime?: string };

export async function addListing(
  {
    buyItNowPrice,
    description,
    images,
    minBidIncrement,
    quantity,
    startingBid,
    title,
    endTime: _endtime,
  }: ListingSubSet,
  item: Item,
  categoryIds: string[],
  userId: string
) {
  const user = await getUserById(userId);
  const endTime = buildListingEndDateAndTime(_endtime);

  const newListing = await prisma.listing.create({
    data: {
      buyItNowPrice,
      description,
      endTime,
      images,
      minBidIncrement,
      quantity,
      startingBid,
      title,
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
      slug: generateSlug(title),
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
