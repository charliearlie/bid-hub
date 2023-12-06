import { PostageType } from "@prisma/client";

export const fulfilmentOptions = [
  [
    {
      method: PostageType.SIGNED_FOR,
      price: 0,
    },
    {
      method: PostageType.STANDARD,
      price: 2,
    },
    {
      method: PostageType.NEXT_DAY,
      price: 4,
    },
  ],
  [
    {
      method: PostageType.COURIER,
      price: 8,
    },
    {
      method: PostageType.STANDARD,
      price: 3,
    },
    {
      method: PostageType.NEXT_DAY,
      price: 4,
    },
  ],
  [
    {
      method: PostageType.STANDARD,
      price: 2,
    },
  ],
  [
    {
      method: PostageType.COURIER,
      price: 4,
    },
    {
      method: PostageType.NEXT_DAY,
      price: 6,
    },
  ],
  [
    {
      method: PostageType.SIGNED_FOR,
      price: 9,
    },
    {
      method: PostageType.STANDARD,
      price: 0,
    },
  ],
  [
    {
      method: PostageType.COURIER,
      price: 5,
    },
  ],
  [
    {
      method: PostageType.STANDARD,
      price: 3,
    },
    {
      method: PostageType.NEXT_DAY,
      price: 5,
    },
  ],
];
