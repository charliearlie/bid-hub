import type { User, Listing, ListingImage, Review } from "@prisma/client";

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
  "id" | "description" | "buyItNowPrice" | "slug" | "title" | "thumbnail"
>;
export type UserType = ReplaceDateProperties<User>;

export type ReviewType = Pick<
  ReplaceDateProperties<Review>,
  "createdAt" | "rating" | "comment"
> & {
  buyer: Pick<User, "avatarUrl" | "username">;
};

export type CoreImageType = Pick<
  ListingImage,
  "altText" | "imageUrl" | "publicId"
>;
