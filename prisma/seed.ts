import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: "Bob@bob.com",
      password: "password",
      username: "Bob",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jimmy@jimmy.com",
      password: "password",
      username: "Jimmy",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "carl@carl.com",
      password: "password",
      username: "Carl",
    },
  });

  const pets = await prisma.category.create({
    data: {
      name: "Pets",
      slug: "pets",
    },
  });

  const petSupplies = await prisma.category.create({
    data: {
      name: "Pet Supplies",
      slug: `pet-supplies`,
      parentId: pets.id,
    },
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Cats",
        slug: "cats",
        parentId: petSupplies.id,
      },
      {
        name: "Dogs",
        slug: "dogs",
        parentId: petSupplies.id,
      },
      {
        name: "Fish & Aquariums",
        slug: "fish-and-aquarium",
        parentId: petSupplies.id,
      },
    ],
  });

  const exoticPets = await prisma.category.create({
    data: {
      name: "Exotic",
      slug: "exotic-pets",
      parentId: petSupplies.id,
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing",
      slug: "clothing",
    },
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Womens Clothing",
        slug: "womens-clothing",
        parentId: clothing.id,
      },
      {
        name: "Kids Clothing",
        slug: "kids-clothing",
        parentId: clothing.id,
      },
    ],
  });

  const mensClothing = await prisma.category.create({
    data: {
      name: "Mens Clothing",
      slug: "mens-clothing",
      parentId: clothing.id,
    },
  });

  const mensJacketsAndCoats = await prisma.category.create({
    data: {
      name: "Mens Jackets & Coats",
      slug: "mens-jackets-and-coats",
      parentId: mensClothing.id,
    },
  });

  const transportation = await prisma.category.create({
    data: {
      name: "Transportation",
      slug: "transportation",
    },
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Cars",
        slug: "cars",
        parentId: transportation.id,
      },
      {
        name: "Electric Scooters",
        slug: "electric-scooters",
        parentId: transportation.id,
      },
      {
        name: "Scooters",
        slug: "scooters",
        parentId: transportation.id,
      },
    ],
  });

  const bicycles = await prisma.category.create({
    data: {
      name: "Bicycles",
      slug: "bicycles",
      parentId: transportation.id,
    },
  });

  const fragrances = await prisma.category.create({
    data: {
      name: "Fragrances",
      slug: "fragrances",
    },
  });

  const sports = await prisma.category.create({
    data: {
      name: "Sports",
      slug: "sports",
    },
  });

  const football = await prisma.category.create({
    data: {
      name: "Football",
      slug: "football",
      parentId: sports.id,
    },
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Basketball",
        slug: "basketball",
        parentId: sports.id,
      },
      {
        name: "Golf",
        slug: "golf",
        parentId: sports.id,
      },
      {
        name: "Baseball",
        slug: "baseball",
        parentId: sports.id,
      },
    ],
  });

  const footballMemorabilia = await prisma.category.create({
    data: {
      name: "Football Memorabilia",
      label: "Memorabilia",
      slug: "football-memorabilia",
      parentId: football.id,
    },
  });

  const footballBalls = await prisma.category.create({
    data: {
      name: "Football Balls",
      label: "Balls",
      slug: "football-balls",
      parentId: football.id,
    },
  });

  const footwear = await prisma.category.create({
    data: {
      name: "Footwear",
      slug: "footwear",
    },
  });

  const mensFootwear = await prisma.category.create({
    data: {
      name: "Mens Footwear",
      slug: "mens-footwear",
      parentId: footwear.id,
    },
  });

  const mensTrainers = await prisma.category.create({
    data: {
      name: "Mens Trainers",
      slug: "mens-footwear-trainers",
      parentId: mensFootwear.id,
    },
  });

  const pcAndVideoGames = await prisma.category.create({
    data: {
      name: "PC & Video Games",
      slug: "pc-and-video-games",
    },
  });

  const playstation = await prisma.category.create({
    data: {
      name: "PlayStation",
      slug: "playstation",
      parentId: pcAndVideoGames.id,
    },
  });

  const playsation5 = await prisma.category.create({
    data: {
      name: "PlayStation 5",
      slug: "playstation-5",
      parentId: playstation.id,
    },
  });

  const playstation5Games = await prisma.category.create({
    data: {
      label: "Games",
      name: "PlayStation 5 Games",
      slug: "playstation-5-games",
      parentId: playsation5.id,
    },
  });

  /**
   * Items
   */
  const sloth = await prisma.item.create({
    data: {
      name: "Sloth",
      description: "A sloth",
    },
  });

  const nikeGeoMerlin = await prisma.item.create({
    data: {
      name: "Nike Geo Merlin",
      description: "A Nike Geo Merlin football",
    },
  });

  const spiderman2Ps5 = await prisma.item.create({
    data: {
      name: "Spiderman 2",
      description: "Spiderman 2 for the PS5",
    },
  });

  const tomFordExtremeNoir = await prisma.item.create({
    data: {
      name: "Tom Ford Extreme Noir Parfum",
      description: "Tom Ford Extreme Noir Parfum",
    },
  });

  const halloweenAirForce1 = await prisma.item.create({
    data: {
      name: "Nike Air Force 1 Low PRM Halloween 2023",
      description: "Halloween Air Force 1",
    },
  });

  const airJordan1Og = await prisma.item.create({
    data: {
      name: "Air Jordan 1 OG",
      description: "Air Jordan 1 OG",
    },
  });

  const specializedBicycle = await prisma.item.create({
    data: {
      name: "Specialized Bicycle",
      description: "Specialized Bicycle",
    },
  });

  const trenchCoat = await prisma.item.create({
    data: {
      name: "Trench Coat",
      description: "Trench Coat",
    },
  });

  const nicholasLatifiRacingHelmet = await prisma.item.create({
    data: {
      name: "Nicholas Latifi Racing Helmet",
      description: "Nicholas Latifi Racing Helmet",
    },
  });

  await prisma.listing.create({
    data: {
      title: "COSTA RICAN SLOTH - BRAND NEW",
      description:
        "A brand new sloth, created in August 2023. I was struck by lightning in a Costa Rican jungle and I woke up to find Steve the Sloth in my bag. He must be the sloth god of thunder.",
      buyItNowPrice: 6000,
      item: {
        connect: {
          id: sloth.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: exoticPets.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user1.id,
        },
      },
      slug: "costa-rican-sloth-brand-new",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698951537/bidhub/bdwhjjsjjsiw5yij3mdb.jpg",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698951537/bidhub/bdwhjjsjjsiw5yij3mdb.jpg",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Nike Geo Merlin",
      description:
        "A Nike Geo Merlin football. This is a collectors item. I have had it for 20 years and I am looking to sell it to a collector.",
      buyItNowPrice: 400,
      minBidIncrement: 5,
      highestBidValue: 15,
      endTime: new Date("2024-08-01T00:00:00.000Z"),
      item: {
        connect: {
          id: nikeGeoMerlin.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: footballBalls.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user1.id,
        },
      },
      slug: "nike-geo-merlin",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699311088/bidhub/agcn68q3odmyt9gbwk39.webp",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699311088/bidhub/agcn68q3odmyt9gbwk39.webp",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Spiderman 2 for PS5",
      description:
        "Spiderman 2 for the PS5. I have completed the game and I am looking to sell it to a collector.",
      buyItNowPrice: 40,
      item: {
        connect: {
          id: spiderman2Ps5.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: playstation5Games.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user1.id,
        },
      },
      slug: "spiderman-2-for-ps5",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/q_auto:eco/v1699308955/bidhub/lpgmice7lu5mf9rcbhmv.jpg",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/q_auto:eco/v1699308955/bidhub/lpgmice7lu5mf9rcbhmv.jpg",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Tom Ford Extreme Noir Parfum",
      description:
        "Tom Ford Extreme Noir Parfum. I have had this for 5 years and I am looking to sell it to a collector.",
      buyItNowPrice: 200,
      item: {
        connect: {
          id: tomFordExtremeNoir.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: fragrances.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user1.id,
        },
      },
      slug: "tom-ford-extreme-noir-parfum",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699377321/bidhub/iznh0glxdtvkziv8di2e.jpg",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699377321/bidhub/iznh0glxdtvkziv8di2e.jpg",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Nike Air Force 1 Low PRM Halloween 2023",
      description:
        "Nike Air Force 1 Low PRM Halloween 2023. I have had these for 2 years and I am looking to sell them to a collector.",
      buyItNowPrice: 100,
      item: {
        connect: {
          id: halloweenAirForce1.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: mensTrainers.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      slug: "nike-air-force-1-low-prm-halloween-2023",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/f_webp,fl_awebp,q_auto/v1699310491/bidhub/tprf9vyfexz6gc4g05dm",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/f_webp,fl_awebp,q_auto/v1699310491/bidhub/tprf9vyfexz6gc4g05dm",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Air Jordan 1 OG",
      description:
        "Air Jordan 1 OG. I have had these for 35 years and I am looking to sell them to a collector.",
      buyItNowPrice: 2900,
      startingBid: 200,
      highestBidValue: 800,
      endTime: new Date("2024-08-01T00:00:00.000Z"),
      item: {
        connect: {
          id: airJordan1Og.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: mensTrainers.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      slug: "air-jordan-1-og",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/f_webp,fl_awebp,q_auto/v1699310312/bidhub/buepvcfyvdz4kahlb88q",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/f_webp,fl_awebp,q_auto/v1699310312/bidhub/buepvcfyvdz4kahlb88q",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Specialized Bicycle",
      description:
        "Specialized Bicycle. I have had this for 5 years and I am looking to sell it to a collector.",
      buyItNowPrice: 350,
      item: {
        connect: {
          id: specializedBicycle.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: bicycles.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      slug: "specialized-bicycle",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699378328/bidhub/nnfxgogio06o0fskykfo.webp",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699378328/bidhub/nnfxgogio06o0fskykfo.webp",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Trench Coat",
      description:
        "Trench Coat. I have had this for 5 years and I am looking to sell it to a collector.",
      minBidIncrement: 5,
      startingBid: 30,
      highestBidValue: 70,
      endTime: new Date("2024-08-01T00:00:00.000Z"),
      item: {
        connect: {
          id: trenchCoat.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: mensJacketsAndCoats.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      slug: "trench-coat",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699378484/bidhub/ik6w9j6qjvz5fzq5nq0r.jpg",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699378484/bidhub/ik6w9j6qjvz5fzq5nq0r.jpg",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Nicholas Latifi Racing Helmet",
      description: "Nicholas Latifi Racing Helmet. His head is still inside it",
      buyItNowPrice: 10000,
      item: {
        connect: {
          id: nicholasLatifiRacingHelmet.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: footballMemorabilia.id,
            },
          },
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      slug: "nicholas-latifi-racing-helmet",
      images: [
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698965417/bidhub/owwvzcl6lynvnv7hfrt3.webp",
      ],
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698965417/bidhub/owwvzcl6lynvnv7hfrt3.webp",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
