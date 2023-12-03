import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

enum PostageType {
  STANDARD = "STANDARD",
  COURIER = "COURIER",
  NEXT_DAY = "NEXT_DAY",
  SIGNED_FOR = "SIGNED_FOR",
}

const prisma = new PrismaClient();

async function seed() {
  const user1 = await prisma.user.create({
    data: {
      email: "Bob@bob.com",
      password: "password",
      username: "Bob",
      avatarUrl:
        "https://res.cloudinary.com/bidhub/image/upload/v1700434074/bidhub/bzszxsa0p4eqspmvkhl9.webp",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jimmy@jimmy.com",
      password: "password",
      username: "Jimmy",
      feedbackScore: 3,
      avatarUrl:
        "https://res.cloudinary.com/bidhub/image/upload/v1700434134/bidhub/vgnzfshat6trm2wb8n1e.jpg",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "carl@carl.com",
      password: "password",
      username: "Carl",
      feedbackScore: 5,
      avatarUrl:
        "https://res.cloudinary.com/bidhub/image/upload/v1700434135/bidhub/tw2k8naxhfmdxukawwe8.jpg",
    },
  });

  const pets = await prisma.category.create({
    data: {
      name: "Pets",
      slug: "pets",
      image:
        "https://res.cloudinary.com/bidhub/image/upload/v1700869356/IMG_2499.webp",
    },
  });

  const petSupplies = await prisma.category.create({
    data: {
      name: "Pet Supplies",
      slug: `pet-supplies`,
      parentId: pets.id,
    },
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
      image:
        "https://res.cloudinary.com/bidhub/image/upload/v1700868794/231603_4.jpg",
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

  await prisma.category.createMany({
    data: [
      {
        name: "Electrical",
        slug: "electrical",
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

  const slothListing = await prisma.listing.create({
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
      category: {
        connect: {
          id: exoticPets.id,
        },
      },
      seller: {
        connect: {
          id: user1.id,
        },
      },
      fulfilmentOptions: {
        create: [
          {
            method: PostageType.STANDARD,
            price: 1,
          },
          {
            method: PostageType.NEXT_DAY,
            price: 5,
          },
        ],
      },
      slug: "costa-rican-sloth-brand-new",
      images: {
        create: [
          {
            altText: "Sloth hanging from branch",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698951537/bidhub/bdwhjjsjjsiw5yij3mdb.jpg",
            publicId: "bidhub/bdwhjjsjjsiw5yij3mdb",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698951537/bidhub/bdwhjjsjjsiw5yij3mdb.jpg",
      quantity: 1,
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
      category: {
        connect: {
          id: footballBalls.id,
        },
      },
      seller: {
        connect: {
          id: user1.id,
        },
      },
      fulfilmentOptions: {
        create: [
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
      },
      slug: "nike-geo-merlin",
      images: {
        create: [
          {
            altText: "Nike Geo Merlin ball face on",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1699311088/bidhub/agcn68q3odmyt9gbwk39.webp",
            publicId: "bidhub/agcn68q3odmyt9gbwk39",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699311088/bidhub/agcn68q3odmyt9gbwk39.webp",
      quantity: 1,
    },
  });

  const spidermanListing = await prisma.listing.create({
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
      category: {
        connect: {
          id: playstation5Games.id,
        },
      },
      seller: {
        connect: {
          id: user3.id,
        },
      },
      fulfilmentOptions: {
        create: [
          {
            method: PostageType.COURIER,
            price: 5,
          },
          {
            method: PostageType.STANDARD,
            price: 2,
          },
        ],
      },
      slug: "spiderman-2-for-ps5",
      images: {
        create: [
          {
            altText: "Spider-Man 2 PS5 game cover",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1699308955/bidhub/lpgmice7lu5mf9rcbhmv.png",
            publicId: "bidhub/lpgmice7lu5mf9rcbhmv",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/q_auto:eco/v1699308955/bidhub/lpgmice7lu5mf9rcbhmv.jpg",
      quantity: 15,
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
      category: {
        connect: {
          id: fragrances.id,
        },
      },
      seller: {
        connect: {
          id: user3.id,
        },
      },
      fulfilmentOptions: {
        create: [
          {
            method: PostageType.SIGNED_FOR,
            price: 6,
          },
          {
            method: PostageType.COURIER,
            price: 4,
          },
        ],
      },
      slug: "tom-ford-extreme-noir-parfum",
      images: {
        create: [
          {
            altText: "Tom Ford Extreme Noir Parfum packaging and bottle",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1699377321/bidhub/iznh0glxdtvkziv8di2e.jpg",
            publicId: "bidhub/iznh0glxdtvkziv8di2e",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699377321/bidhub/iznh0glxdtvkziv8di2e.jpg",
      quantity: 100,
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
      category: {
        connect: {
          id: mensTrainers.id,
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      fulfilmentOptions: {
        create: [
          {
            method: PostageType.NEXT_DAY,
            price: 10,
          },
          {
            method: PostageType.STANDARD,
            price: 5,
          },
        ],
      },
      slug: "nike-air-force-1-low-prm-halloween-2023",
      images: {
        create: [
          {
            altText: "Nike Air Force 1 Halloween placed on rocks",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1699310491/bidhub/tprf9vyfexz6gc4g05dm.png",
            publicId: "bidhub/tprf9vyfexz6gc4g05dm",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/f_webp,fl_awebp,q_auto/v1699310491/bidhub/tprf9vyfexz6gc4g05dm",
      quantity: 5,
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
      category: {
        connect: {
          id: mensTrainers.id,
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      fulfilmentOptions: {
        create: [
          {
            method: PostageType.COURIER,
            price: 11,
          },
          {
            method: PostageType.STANDARD,
            price: 9,
          },
          {
            method: PostageType.NEXT_DAY,
            price: 15,
          },
        ],
      },
      slug: "air-jordan-1-og",
      images: {
        create: [
          {
            altText: "Air Jordan 1 OG with a plain white background",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1699310312/bidhub/buepvcfyvdz4kahlb88q.jpg",
            publicId: "bidhub/buepvcfyvdz4kahlb88q",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/f_webp,fl_awebp,q_auto/v1699310312/bidhub/buepvcfyvdz4kahlb88q",
      quantity: 1,
    },
  });

  const bikeListing = await prisma.listing.create({
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
      category: {
        connect: {
          id: bicycles.id,
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      fulfilmentOptions: {
        create: [
          {
            method: PostageType.NEXT_DAY,
            price: 25,
          },
          {
            method: PostageType.STANDARD,
            price: 15,
          },
        ],
      },
      slug: "specialized-bicycle",
      images: {
        create: [
          {
            altText:
              "Black Specialized Bicycle side on with a plain white background",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1699378328/bidhub/nnfxgogio06o0fskykfo.webp",
            publicId: "bidhub/nnfxgogio06o0fskykfo",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1699378328/bidhub/nnfxgogio06o0fskykfo.webp",
      quantity: 1,
    },
  });

  const trenchCoatListing = await prisma.listing.create({
    data: {
      title: "Trench Coat",
      description: faker.commerce.productDescription(),
      minBidIncrement: 5,
      startingBid: 30,
      highestBidValue: 70,
      endTime: new Date("2024-08-01T00:00:00.000Z"),
      item: {
        connect: {
          id: trenchCoat.id,
        },
      },
      category: {
        connect: {
          id: mensJacketsAndCoats.id,
        },
      },
      seller: {
        connect: {
          id: user3.id,
        },
      },
      fulfilmentOptions: {
        create: [
          {
            method: PostageType.COURIER,
            price: 0,
          },
        ],
      },
      slug: "trench-coat",
      images: {
        create: [
          {
            altText: "Beige trench coat with slight dirt patches",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700502973/bidhub/drsdupwa94efhpmfibsq.webp",
            publicId: "bidhub/drsdupwa94efhpmfibsq",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/t_Site-preview/v1700502973/bidhub/drsdupwa94efhpmfibsq.webp",
      quantity: 1,
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
      category: {
        connect: {
          id: footballMemorabilia.id,
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      fulfilmentOptions: {
        create: [
          {
            method: PostageType.NEXT_DAY,
            price: 30,
          },
        ],
      },
      slug: "nicholas-latifi-racing-helmet",
      images: {
        create: [
          {
            altText:
              "Side on view of a 2021 helmet, race worn by Nicholas Latifi",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698965417/bidhub/owwvzcl6lynvnv7hfrt3.webp",
            publicId: "bidhub/owwvzcl6lynvnv7hfrt3",
          },
          {
            altText: "SpongeBob SquarePants",
            imageUrl:
              "https://res.cloudinary.com/bidhub/image/upload/v1700494508/spongebob-not-normal-e1661340467476.webp",
            publicId: "spongebob-not-normal-e1661340467476",
          },
        ],
      },
      thumbnail:
        "https://res.cloudinary.com/bidhub/image/upload/c_fit,h_1080,w_1920/v1698965417/bidhub/owwvzcl6lynvnv7hfrt3.webp",
    },
  });

  const bobsHouse = await prisma.address.create({
    data: {
      name: "Home",
      addressLine1: faker.location.streetAddress(),
      cityOrTown: faker.location.city(),
      country: faker.location.country(),
      postcode: faker.location.zipCode(),
      user: {
        connect: {
          id: user1.id,
        },
      },
    },
  });

  const jimmysHouse = await prisma.address.create({
    data: {
      name: "Home",
      addressLine1: faker.location.streetAddress(),
      cityOrTown: faker.location.city(),
      country: faker.location.country(),
      postcode: faker.location.zipCode(),
      user: {
        connect: {
          id: user2.id,
        },
      },
    },
  });

  const jimmysGirlfriends = await prisma.address.create({
    data: {
      name: "Girlfriend's house",
      addressLine1: faker.location.streetAddress(),
      cityOrTown: faker.location.city(),
      country: faker.location.country(),
      postcode: faker.location.zipCode(),
      user: {
        connect: {
          id: user2.id,
        },
      },
    },
  });

  await prisma.order.create({
    data: {
      buyer: {
        connect: {
          id: user2.id,
        },
      },
      seller: {
        connect: {
          id: user1.id,
        },
      },
      listing: {
        connect: {
          id: slothListing.id,
        },
      },
      fulfilmentDetails: {
        create: {
          deliveryAddress: {
            connect: {
              id: jimmysHouse.id,
            },
          },
        },
      },
      quantity: 1,
      status: "DELIVERED",
      totalAmount: 6000,
    },
  });

  await prisma.order.create({
    data: {
      buyer: {
        connect: {
          id: user1.id,
        },
      },
      seller: {
        connect: {
          id: user2.id,
        },
      },
      listing: {
        connect: {
          id: bikeListing.id,
        },
      },
      fulfilmentDetails: {
        create: {
          deliveryAddress: {
            connect: {
              id: bobsHouse.id,
            },
          },
        },
      },
      quantity: 1,
      status: "PENDING",
      totalAmount: 6000,
    },
  });

  await prisma.order.create({
    data: {
      buyer: {
        connect: {
          id: user2.id,
        },
      },
      seller: {
        connect: {
          id: user3.id,
        },
      },
      listing: {
        connect: {
          id: spidermanListing.id,
        },
      },
      fulfilmentDetails: {
        create: {
          deliveryAddress: {
            connect: {
              id: jimmysGirlfriends.id,
            },
          },
        },
      },
      quantity: 1,
      status: "PENDING",
      totalAmount: 6000,
    },
  });

  await prisma.user.update({
    where: {
      id: user1.id,
    },
    data: {
      feedbackGiven: {
        create: [
          {
            rating: 5,
            sellerId: user2.id,
            comment: "Great seller, would buy from again",
            listingId: slothListing.id,
          },
          {
            rating: 3,
            sellerId: user3.id,
            comment: "Clothes were great but a bit smelly",
            listingId: trenchCoatListing.id,
          },
        ],
      },
      feedbackReceived: {
        create: [
          {
            rating: 2,
            buyerId: user2.id,
            comment: "Bought from me but paid in pennies",
            listingId: bikeListing.id,
          },
        ],
      },
    },
  });
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
