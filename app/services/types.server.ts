import type { User } from "@prisma/client";

export type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export type LoginForm = {
  email: string;
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

export type UserType = ReplaceDateProperties<User>;

// A partial type that requires at least one of the keys. These keys can be passed in.
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
