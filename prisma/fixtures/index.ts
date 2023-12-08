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

type ProductDetails =
  | {
      author?: string;
      publisher?: string;
      language?: string;
      publicationYear?: number;
      pageCount?: number;
      brand?: string;
      sizes?: string[];
      colours?: string[];
      materials?: string[];
      fit?: string;
      developer?: string;
      releaseDate?: Date;
      platform?: string[];
      genre?: string[];
    }
  | undefined;

export const productDetails: ProductDetails[] = [
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
      [
        "PlayStation 5",
        "PlayStation 4",
        "Xbox Series",
        "Xbox One",
        "Nintendo Switch",
        "PC",
      ],
      {
        min: 1,
        max: 3,
      }
    ),
    genre: faker.helpers.arrayElements(
      [
        "Action/Adventure",
        "First Person Shooter",
        "RPG",
        "Racing",
        "Sports",
        "Puzzle",
      ],
      { min: 1, max: 1 }
    ),
  },
  undefined,
];

export const cloudinaryImages: {
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
