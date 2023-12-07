import { faker } from "@faker-js/faker";
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

export const productDetails = [
  {
    author: faker.person.fullName(),
    publisher: faker.company.name(),
    language: "English",
    publicationYear: faker.date.past().getFullYear(),
    pageCount: faker.number.int({ min: 100, max: 1000 }),
  },
  {
    brand: faker.company.name(),
    sizes: faker.helpers.arrayElements(["XS", "SM", "MD", "LG", "XL"], {
      min: 1,
      max: 4,
    }),
    colours: faker.helpers.arrayElements(
      [
        "Green",
        "Blue",
        "Red",
        "Beige",
        "Black",
        "White",
        "Yellow",
        "Orange",
        "Purple",
        "Pink",
      ],
      {
        min: 1,
        max: 2,
      }
    ),
    materials: faker.helpers.arrayElements(
      ["Linen", "Polyester", "Leather", "Rubber", "Cotton"],
      {
        min: 1,
        max: 3,
      }
    ),
    fit: faker.commerce.productAdjective(),
  },
  {
    developer: faker.company.name(),
    publisher: faker.company.name(),
    language: "English",
    releaseDate: faker.date.past(),
    platform: faker.helpers.arrayElements(
      ["PlayStation 5", "PlayStation 4", "Xbox Series", "Xbox One", "Nintendo Switch", "PC"],
      {
        min: 1,
        max: 3,
      }
    ),
    genre: faker.helpers.arrayElements(
      ["Action/Adventure", "First Person Shooter", "RPG", "Racing", "Sports", "Puzzle"], {min: 1, max: 1}
    ),
  },
  undefined
]
