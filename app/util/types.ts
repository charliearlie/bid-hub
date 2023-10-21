import { Car, User } from "@prisma/client";

export type ReplaceDateProperties<T> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type CarType = ReplaceDateProperties<Car>;
export type UserType = ReplaceDateProperties<User>;
