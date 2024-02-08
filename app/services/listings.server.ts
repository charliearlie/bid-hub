import type { Listing } from "@prisma/client";

import type { CoreImageType } from "~/types";

import { buildListingEndDateAndTime, generateSlug } from "~/util/utils";

import { prisma } from "../util/prisma.server";
import { getUserById } from "./user.server";

export async function getAllListings(
  { amount }: { amount?: number } = { amount: 500 }
) {
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
      productDetails: {
        select: {
          sizes: true,
          colours: true,
          materials: true,
          fit: true,
          brand: true,
          style: true,
          gender: true,
          modelNumber: true,
          powerSource: true,
          voltage: true,
          wattage: true,
          connectivity: true,
          features: true,
          dimensions: true,
          weight: true,
          certifications: true,
          usageInstructions: true,
          warrantyInformation: true,
          isSmart: true,
          compatibleDevices: true,
          author: true,
          genre: true,
          language: true,
          pageCount: true,
          publicationYear: true,
          publisher: true,
          ISBN: true,
          developer: true,
          platform: true,
          releaseDate: false, // Explicit about this as we need to map the type
        },
      },
      warranty: true,
      reviews: {
        select: {
          comment: true,
          rating: true,
          createdAt: true,
          buyer: {
            select: {
              avatarUrl: true,
              username: true,
            },
          },
          listing: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  const numberOfReviews = await prisma.review.count({
    where: {
      listingId: listing.id,
    },
  });

  return { listing, numberOfReviews };
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

export const getListingsByCategory = async (
  categoryId: string,
  take?: number
) => {
  const listings = await prisma.listing.findMany({
    where: {
      categoryId,
    },
    take,
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

export const getUsersListings = async (username: string) => {
  const listings = await prisma.listing.findMany({
    where: {
      seller: {
        username,
      },
    },
  });

  return listings;
};

export type SearchOptions = {
  take?: number;
  skip?: number;
  orderBy?: {
    [key: string]: "asc" | "desc";
  };
};

export const getSearchListings = async (
  query: string,
  options: SearchOptions = {
    take: 10,
    skip: 0,
    orderBy: {
      createdAt: "desc",
    },
  }
) => {
  const matchedByTitle = await prisma.listing.findMany({
    where: {
      title: {
        search: query,
      },
    },
    ...options,
  });

  const matchedByDescription = await prisma.listing.findMany({
    where: {
      description: {
        search: query,
      },
    },
  });

  // Give weighting to title matches
  return [...matchedByTitle, ...matchedByDescription];
};
