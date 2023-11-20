import type { Item, Listing } from "@prisma/client";

import { buildListingEndDateAndTime, generateSlug } from "~/util/utils";

import { prisma } from "../util/prisma.server";
import { getUserById } from "./user.server";

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
  | "thumbnail"
  | "images"
  | "categoryId"
> & { endTime?: string };

export async function addListing(
  {
    buyItNowPrice,
    categoryId,
    description,
    images,
    minBidIncrement,
    quantity,
    startingBid,
    title,
    endTime: _endtime,
    thumbnail,
  }: ListingSubSet,
  item: Item,
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
      category: {
        connect: {
          id: categoryId,
        },
      },
      slug: generateSlug(title),
      thumbnail,
    },
  });

  return newListing;
}

export const getListingBySlug = async (slug: string) => {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      item: true,
      category: true,
      seller: {
        select: {
          avatarUrl: true,
          feedbackScore: true,
          username: true,
        },
      },
    },
  });

  return listing;
};

export const getListingsByCategory = async (categoryId: string) => {
  const listings = await prisma.listing.findMany({
    where: {
      categoryId,
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

export async function getCategoryAndParents(categoryId: string) {
  const result = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
    include: {
      parentCategory: true,
    },
  });

  return result;
}
