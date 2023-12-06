import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { fulfilmentOptions } from "./fixtures";

enum PostageType {
  STANDARD = "STANDARD",
  COURIER = "COURIER",
  NEXT_DAY = "NEXT_DAY",
  SIGNED_FOR = "SIGNED_FOR",
}

const prisma = new PrismaClient();

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

  for (let i = 0; i < 50; i++) {
    const sellerId =
      userIds[faker.number.int({ min: 1, max: userIds.length - 1 })];
    await prisma.address.create({
      data: {
        name: faker.word.noun(),
        addressLine1: faker.location.streetAddress(),
        cityOrTown: faker.location.city(),
        country: faker.location.country(),
        postcode: faker.location.zipCode(),
        user: {
          connect: {
            id: sellerId,
          },
        },
      },
    });

    const item = await prisma.item.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
      },
    });

    const image =
      cloudinaryImages[
        faker.number.int({ min: 0, max: cloudinaryImages.length - 1 })
      ];

    const listingName = faker.commerce.productName();
    const listing = await prisma.listing.create({
      data: {
        title: listingName,
        description: faker.commerce.productDescription(),
        buyItNowPrice: Math.ceil(Number(faker.commerce.price())),
        item: {
          connect: {
            id: item.id,
          },
        },
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
        slug: faker.helpers.slugify(listingName),
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
                "https://res.cloudinary.com/bidhub/image/upload/v1701896677/bidhub/jgdsonl7q0nkqgw0eksu.webp",
              publicId: "bidhub/jgdsonl7q0nkqgw0eksu",
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
        fulfilmentOptions: {
          create:
            fulfilmentOptions[
              faker.number.int({ min: 0, max: fulfilmentOptions.length - 1 })
            ],
        },
      },
    });
  }
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
