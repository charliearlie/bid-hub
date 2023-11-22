import { User, Item, Listing, ListingImage } from "@prisma/client";

export type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export type LoginForm = {
  emailOrUsername: string;
  password: string;
};

export type EditUserForm = {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

export type ManufacturerForm = {
  name: string;
  country: string;
  discipline?: string;
};

type RegisterErrors = {
  email?: string;
  password?: string;
  username?: string;
  server?: string;
};

export type RegisterResponse = {
  errors: RegisterErrors;
  success: boolean;
};

export type ReplaceDateProperties<T> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type ListingPreviewType = Pick<
  Listing,
  "id" | "highestBidValue" | "buyItNowPrice" | "slug" | "title" | "thumbnail"
>;
export type ItemType = ReplaceDateProperties<Item>;
export type UserType = ReplaceDateProperties<User>;

export type CoreImageType = Pick<
  ListingImage,
  "altText" | "imageUrl" | "publicId"
>;
