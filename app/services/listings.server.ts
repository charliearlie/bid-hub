import type { Item, Listing } from "@prisma/client";

import { CoreImageType } from "~/types";

import { buildListingEndDateAndTime, generateSlug } from "~/util/utils";

import { prisma } from "../util/prisma.server";
import { getUserById } from "./user.server";

export async function getAllListings({ amount }: { amount?: number }) {
  return await prisma.listing.findMany({
    include: { images: true },
    take: amount,
  });
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

export const addListing = async (
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
) => {
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
};

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
      fulfilmentOptions: {
        select: {
          minDays: true,
          maxDays: true,
          method: true,
          price: true,
        },
      },
      clothingOptions: {
        select: {
          sizes: true,
          colours: true,
          materials: true,
          fit: true,
        },
      },
      electricalOptions: true,
      warranty: true,
    },
  });

  return listing;
};

export const doesUserLikeListing = async (
  userId: string,
  listingId: string
) => {
  const result = await prisma.watch.findFirst({
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

export const toggleLikeOnListing = async (
  listingId: string,
  userId: string
) => {
  const watch = await prisma.watch.findFirst({
    where: {
      listingId,
      userId,
    },
  });

  const userLikesListing = !!watch;

  if (userLikesListing) {
    await prisma.watch.delete({
      where: {
        id: watch.id,
      },
    });
  } else {
    await prisma.watch.create({
      data: {
        listingId,
        userId,
      },
    });
  }

  return !userLikesListing;
};
