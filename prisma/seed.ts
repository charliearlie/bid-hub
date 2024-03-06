import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import {
  cloudinaryImages,
  fulfilmentOptions,
  productDetails,
} from "./fixtures";
import { createCategoriesWithImages, createTestData } from "./helpers";

const prisma = new PrismaClient();
async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  // await prisma.order.create({
  //   data: {
  //     buyer: {
  //       connect: {
  //         id: user2.id,
  //       },
  //     },
  //     seller: {
  //       connect: {
  //         id: user1.id,
  //       },
  //     },
  //     listing: {
  //       connect: {
  //         id: slothListing.id,
  //       },
  //     },
  //     fulfilmentDetails: {
  //       create: {
  //         deliveryAddress: {
  //           connect: {
  //             id: jimmysHouse.id,
  //           },
  //         },
  //       },
  //     },
  //     quantity: 1,
  //     status: "DELIVERED",
  //     totalAmount: 6000,
  //   },
  // });

  // await prisma.order.create({
  //   data: {
  //     buyer: {
  //       connect: {
  //         id: user1.id,
  //       },
  //     },
  //     seller: {
  //       connect: {
  //         id: user2.id,
  //       },
  //     },
  //     listing: {
  //       connect: {
  //         id: bikeListing.id,
  //       },
  //     },
  //     fulfilmentDetails: {
  //       create: {
  //         deliveryAddress: {
  //           connect: {
  //             id: bobsHouse.id,
  //           },
  //         },
  //       },
  //     },
  //     quantity: 1,
  //     status: "PENDING",
  //     totalAmount: 6000,
  //   },
  // });

  // await prisma.order.create({
  //   data: {
  //     buyer: {
  //       connect: {
  //         id: user2.id,
  //       },
  //     },
  //     seller: {
  //       connect: {
  //         id: user3.id,
  //       },
  //     },
  //     listing: {
  //       connect: {
  //         id: spidermanListing.id,
  //       },
  //     },
  //     fulfilmentDetails: {
  //       create: {
  //         deliveryAddress: {
  //           connect: {
  //             id: jimmysGirlfriends.id,
  //           },
  //         },
  //       },
  //     },
  //     quantity: 1,
  //     status: "PENDING",
  //     totalAmount: 6000,
  //   },
  // });

  // await prisma.user.update({
  //   where: {
  //     id: user1.id,
  //   },
  //   data: {
  //     feedbackGiven: {
  //       create: [
  //         {
  //           rating: 5,
  //           sellerId: user2.id,
  //           comment: "Great seller, would buy from again",
  //           listingId: slothListing.id,
  //         },
  //         {
  //           rating: 3,
  //           sellerId: user3.id,
  //           comment: "Clothes were great but a bit smelly",
  //           listingId: trenchCoatListing.id,
  //         },
  //       ],
  //     },
  //     feedbackReceived: {
  //       create: [
  //         {
  //           rating: 2,
  //           buyerId: user2.id,
  //           comment: "Bought from me but paid in pennies",
  //           listingId: bikeListing.id,
  //         },
  //       ],
  //     },
  //   },
  // });

  const userIds = await Promise.all(
    Array.from({ length: 25 }, async (_, i) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email({
            allowSpecialCharacters: false,
            firstName,
            lastName,
          }),
          password: faker.internet.password(),
          username: faker.internet.userName(),
          feedbackScore: faker.number.int({ min: 1, max: 5 }),
          avatarUrl: faker.image.urlPicsumPhotos(),
        },
      });

      return user.id;
    })
  );

  const fakerCategories = [
    ...new Set(Array.from({ length: 40 }, () => faker.commerce.department())),
  ];

  const categoryIds = await Promise.all(
    fakerCategories.map(async (category) => {
      const newCategory = await prisma.category.create({
        data: {
          name: category,
          slug: faker.helpers.slugify(category),
        },
      });

      return newCategory.id;
    })
  );

  userIds.forEach(async (userId) => {
    await prisma.address.create({
      data: {
        name: faker.word.noun(),
        addressLine1: faker.location.streetAddress(),
        cityOrTown: faker.location.city(),
        country: faker.location.country(),
        postcode: faker.location.zipCode(),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  });

  const listingInserts = Array.from({ length: 150 }, () => {
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
        buyItNowPrice: Math.ceil(
          Number(faker.commerce.price({ min: 5, max: 150 }))
        ),
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
  });

  // https://github.com/prisma/prisma/issues/8131
  await prisma.$transaction(listingInserts);

  createCategoriesWithImages(prisma);
  setTimeout(async () => {
    await createTestData(prisma, userIds, categoryIds);
    console.log("🌱 Categories have been seeded");
  }, 5000);

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
