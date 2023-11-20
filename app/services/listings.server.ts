import type { Item, Listing } from "@prisma/client";

import { CoreImageType } from "~/util/types";
import { buildListingEndDateAndTime, generateSlug } from "~/util/utils";

import { prisma } from "../util/prisma.server";
import { getUserById } from "./user.server";

export async function getAllListings() {
  return await prisma.listing.findMany({ include: { images: true } });
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
  | "categoryId"
> & { endTime?: string; images: CoreImageType[] };

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
      images: {
        create: images.map((image) => ({
          ...image,
        })),
      },
      slug: generateSlug(title),
      thumbnail,
    },
  });

  return newListing;
}

export const getListingBySlug = async (slug: string) => {
  const listing = await prisma.listing.findUniqueOrThrow({
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
      images: {
        select: {
          altText: true,
          imageUrl: true,
          publicId: true,
        },
      },
    },
  });

  return listing;
};

export const doesUserLikeListing = async (
  userId: string,
  listingId: string
) => {
  const result = await prisma.like.findFirst({
    where: {
      listingId,
      userId,
    },
  });

  return Boolean(result);
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

export const toggleLikeOnListing = async (
  listingId: string,
  userId: string
) => {
  const like = await prisma.like.findFirst({
    where: {
      listingId,
      userId,
    },
  });

  const userLikesListing = !!like;

  if (userLikesListing) {
    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        listingId,
        userId,
      },
    });
  }

  return !userLikesListing;
};
