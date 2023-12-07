import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import {
  createCategoriesWithImages,
  createListing,
} from "./helpers";

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

  for (let i = 0; i < 100; i++) {
    createListing(prisma, userIds, categoryIds);
  }

  createCategoriesWithImages(prisma);

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
