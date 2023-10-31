import { User, Item, Listing } from "@prisma/client";

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
  "id" | "highestBidValue" | "buyItNowPrice" | "images" | "slug" | "title"
>;

type ItemPreviewType = Pick<Item, "name" | "description">;

export type ItemListingPreviewType = ListingPreviewType & ItemPreviewType;

export type ItemType = ReplaceDateProperties<Item>;
export type UserType = ReplaceDateProperties<User>;
