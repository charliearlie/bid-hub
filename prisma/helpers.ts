import { faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { fulfilmentOptions, productDetails, userData } from "./fixtures";

const cloudinaryImages: {
  altText: string;
  imageUrl: string;
  publicId: string;
  thumbnail: string;
}[] = [
  {
    altText: "Sloth hanging from branch",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698951537/bidhub/bdwhjjsjjsiw5yij3mdb.jpg",
    publicId: "bidhub/bdwhjjsjjsiw5yij3mdb",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698951537/bidhub/bdwhjjsjjsiw5yij3mdb.jpg",
  },
  {
    altText: "Nike Geo Merlin ball face on",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1699311088/bidhub/agcn68q3odmyt9gbwk39.webp",
    publicId: "bidhub/agcn68q3odmyt9gbwk39",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699311088/bidhub/agcn68q3odmyt9gbwk39.webp",
  },
  {
    altText: "Spider-Man 2 PS5 game cover",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1699308955/bidhub/lpgmice7lu5mf9rcbhmv.png",
    publicId: "bidhub/lpgmice7lu5mf9rcbhmv",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/q_auto:eco/v1699308955/bidhub/lpgmice7lu5mf9rcbhmv.jpg",
  },
  {
    altText: "Tom Ford Extreme Noir Parfum packaging and bottle",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1699377321/bidhub/iznh0glxdtvkziv8di2e.jpg",
    publicId: "bidhub/iznh0glxdtvkziv8di2e",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699377321/bidhub/iznh0glxdtvkziv8di2e.jpg",
  },
  {
    altText: "Nike Air Force 1 Halloween placed on rocks",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1699310491/bidhub/tprf9vyfexz6gc4g05dm.png",
    publicId: "bidhub/tprf9vyfexz6gc4g05dm",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/f_webp,fl_awebp,q_auto/v1699310491/bidhub/tprf9vyfexz6gc4g05dm",
  },
  {
    altText: "Air Jordan 1 OG with a plain white background",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1699310312/bidhub/buepvcfyvdz4kahlb88q.jpg",
    publicId: "bidhub/buepvcfyvdz4kahlb88q",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/f_webp,fl_awebp,q_auto/v1699310312/bidhub/buepvcfyvdz4kahlb88q",
  },
  {
    altText: "Beige trench coat with slight dirt patches",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1700502973/bidhub/drsdupwa94efhpmfibsq.webp",
    publicId: "bidhub/drsdupwa94efhpmfibsq",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/t_Site-preview/v1700502973/bidhub/drsdupwa94efhpmfibsq.webp",
  },
  {
    altText: "Side on view of a 2021 helmet, race worn by Nicholas Latifi",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698965417/bidhub/owwvzcl6lynvnv7hfrt3.webp",
    publicId: "bidhub/owwvzcl6lynvnv7hfrt3",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698965417/bidhub/owwvzcl6lynvnv7hfrt3.webp",
  },
  {
    altText: "Ugg slippers against exposed brick wall",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1701891983/bidhub/b9c0ctgfkvrf3vxtktx0.webp",
    publicId: "bidhub/b9c0ctgfkvrf3vxtktx0",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/v1701891986/bidhub/myuo0bzokx5tzpovg6sw.webp",
  },
  {
    altText: "Lego Upscaled Minifigure box",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892173/bidhub/ysfnvspuedmwruteire3.webp",
    publicId: "bidhub/ysfnvspuedmwruteire3",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892174/bidhub/tqwud93tpjoowqnmopid.webp",
  },
  {
    altText: "Front of Canon EOS 90D",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892260/bidhub/a2ln4ipipyi4ovhrmohv.webp",
    publicId: "bidhub/a2ln4ipipyi4ovhrmohv",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892263/bidhub/ginadegf1hyt0qq9cjl7.webp",
  },
  {
    altText: "DJI Mavic Pro",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892506/bidhub/a755wxfrmxpegc1z9cqu.webp",
    publicId: "bidhub/a755wxfrmxpegc1z9cqu",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892508/bidhub/ymw6qqijqjjwdunvc4hr.webp",
  },
  {
    altText: "The North Face coat",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892560/bidhub/pq37pcxmrgztgqh449aw.webp",
    publicId: "bidhub/pq37pcxmrgztgqh449aw",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892562/bidhub/a1fesk8zxghltksg7yfv.webp",
  },
  {
    altText: "Apple iPad",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892610/bidhub/oes5sd8jvtvs2agij6eb.webp",
    publicId: "bidhub/oes5sd8jvtvs2agij6eb",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892616/bidhub/dai2cywtbmiutgmuinmn.webp",
  },
  {
    altText: "Google Nexus 5",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892664/bidhub/kgyge3er4seoaiqlznso.webp",
    publicId: "bidhub/kgyge3er4seoaiqlznso",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/v1701892667/bidhub/vyzaw3jzuvcn1c9ft2p1.webp",
  },
  {
    altText: "Arsenal x Masahiri hoodie",
    imageUrl:
      "https://res.cloudinary.com/bidhub/image/upload/v1700861749/bidhub/wse1ukdsqcqqvdvg0n7q.webp",
    publicId: "bidhub/wse1ukdsqcqqvdvg0n7q",
    thumbnail:
      "https://res.cloudinary.com/bidhub/image/upload/v1700861751/bidhub/jteq7onnq9r03eqjuznk.webp",
  },
];

export const createCategoriesWithImages = async (prisma: PrismaClient) => {
  await prisma.category.createMany({
    data: [
      {
        name: "Pets",
        slug: "pets",
        image:
          "https://res.cloudinary.com/bidhub/image/upload/v1700869356/IMG_2499.webp",
      },
      {
        name: "Headphones",
        slug: "headphones",
        image:
          "https://res.cloudinary.com/bidhub/image/upload/v1700868557/e6864b26fb5e95a2df86455dc82869e1_XL.jpg",
      },
      {
        name: "Furniture",
        slug: "furniture",
        image:
          "https://res.cloudinary.com/bidhub/image/upload/v1700869357/photo-1567016432779-094069958ea5_copy.webp",
      },
      {
        name: "Consoles",
        slug: "consoles",
        image:
          "https://res.cloudinary.com/bidhub/image/upload/v1700868794/231603_4.jpg",
      },
    ],
  });
};

export const createListing = async (
  prisma: PrismaClient,
  userIds: string[],
  categoryIds: string[]
) => {
  const sellerId =
    userIds[faker.number.int({ min: 1, max: userIds.length - 1 })];

  const image =
    cloudinaryImages[
      faker.number.int({ min: 0, max: cloudinaryImages.length - 1 })
    ];

  const listingName = faker.commerce.productName();
  const productDeets = productDetails[faker.number.int({ min: 0, max: 3 })];

  return prisma.listing.create({
    data: {
      title: listingName,
      description: faker.commerce.productDescription(),
      buyItNowPrice: Math.ceil(Number(faker.commerce.price())),
      category: {
        connect: {
          id: categoryIds[
            faker.number.int({ min: 1, max: categoryIds.length - 1 })
          ],
        },
      },
      seller: {
        connect: {
          id: sellerId,
        },
      },
      slug: `${faker.helpers.slugify(listingName)}-${uuidv4()}`,
      thumbnail: image.thumbnail,
      quantity: faker.number.int({ min: 10, max: 1000 }),
      images: {
        create: [
          {
            altText: image.altText,
            imageUrl: image.imageUrl,
            publicId: image.publicId,
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1701896680/bidhub/dxcfmoarddecngekkg7w.webp",
            publicId: "bidhub/dxcfmoarddecngekkg7w",
          },
        ],
      },
      rating: faker.number.int({ min: 1, max: 5 }),
      reviews: {
        create: [1, 2, 3].map(() => ({
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.paragraph(),
          buyer: {
            connect: {
              id: userIds[
                faker.number.int({ min: 1, max: userIds.length - 1 })
              ],
            },
          },
          seller: {
            connect: {
              id: sellerId,
            },
          },
        })),
      },
      numberSold: faker.number.int({ min: 0, max: 100 }),
      warranty: {
        create: {
          duration: faker.number.int({ min: 1, max: 24 }),
          bidHubExtendedWarranty: faker.datatype.boolean(),
          extendable: true,
        },
      },
      fulfilmentOptions: {
        create:
          fulfilmentOptions[
            faker.number.int({ min: 0, max: fulfilmentOptions.length - 1 })
          ],
      },
      productDetails: {
        create: productDeets,
      },
    },
  });
};

export const createTestData = async (
  prisma: PrismaClient,
  userIds: string[],
  categoryIds: string[]
) => {
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      username: userData.username,
      feedbackScore: 5,
      avatarUrl: faker.image.urlPicsumPhotos(),
    },
  });

  await prisma.address.create({
    data: {
      name: "Test Person",
      addressLine1: "101 Test Lane",
      cityOrTown: "Testville",
      country: "Testland",
      postcode: "TE5T 1NG",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await prisma.listing.create({
    data: {
      title: "Test listing",
      description: "Description for test listing",
      buyItNowPrice: 150,
      category: {
        connect: {
          id: categoryIds[
            faker.number.int({ min: 1, max: categoryIds.length - 1 })
          ],
        },
      },
      seller: {
        connect: {
          id: user.id,
        },
      },
      slug: `${faker.helpers.slugify("Test listing")}-${uuidv4()}`,
      thumbnail: cloudinaryImages[0].thumbnail,
      quantity: 10,
      images: {
        create: [
          {
            altText: cloudinaryImages[0].altText,
            imageUrl: cloudinaryImages[0].imageUrl,
            publicId: cloudinaryImages[0].publicId,
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1701896680/bidhub/dxcfmoarddecngekkg7w.webp",
            publicId: "bidhub/dxcfmoarddecngekkg7w",
          },
        ],
      },
      rating: 4,
      reviews: {
        create: [1, 2, 3].map(() => ({
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.paragraph(),
          buyer: {
            connect: {
              id: userIds[
                faker.number.int({ min: 1, max: userIds.length - 1 })
              ],
            },
          },
          seller: {
            connect: {
              id: user.id,
            },
          },
        })),
      },
      numberSold: faker.number.int({ min: 0, max: 100 }),
      warranty: {
        create: {
          duration: 12,
          bidHubExtendedWarranty: true,
          extendable: true,
        },
      },
      fulfilmentOptions: {
        create:
          fulfilmentOptions[
            faker.number.int({ min: 0, max: fulfilmentOptions.length - 1 })
          ],
      },
      productDetails: {
        create: {
          brand: "Testisoft",
          sizes: ["SM", "MD", "LG", "XL"],
          materials: ["Rubber", "Leather"],
          fit: "Slim",
          colours: ["Black", "White"],
        },
      },
    },
  });
};
