import { json } from "@remix-run/node";
import type { Car, Prisma } from "@prisma/client";
import { typedjson } from "remix-typedjson";
import { prisma } from "./prisma.server";

export async function getAllCars() {
  return typedjson({ cars: await prisma.car.findMany() });
}

export async function addManufacturer({
  name,
  country,
  discipline,
}: Prisma.ManufacturerCreateInput) {
  const newManufacturer = await prisma.manufacturer.create({
    data: {
      name,
      country,
      ...(discipline && { discipline }),
    },
  });

  return json(newManufacturer);
}

// There must be a better type to use for car here
export async function addCar(car: Omit<Car, "id" | "createdAt" | "updatedAt">) {
  const newCar = await prisma.car.create({
    data: {
      ...car,
    },
  });

  return json(newCar);
}

export const editCar = async (carId: string) => {
  const editedCar = await prisma.car.update({
    where: {
      id: carId,
    },
    data: {
      images: [
        {
          imageUrl:
            "https://res.cloudinary.com/bidhub/image/upload/v1678784825/brakeneck/a4qk0kwisopj2l38add1.jpg",
          credit: "Mark Sutton - Motorsport Images",
        },
      ],
    },
  });

  return json(editedCar);
};

export const getCarBySlug = async (slug: string) => {
  const car = await prisma.car.findUnique({ where: { slug } });
  return car ? json<Car>(car) : null;
};
