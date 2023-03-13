import { json } from "@remix-run/node";
import { Car, Prisma } from "@prisma/client";
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
      slug: "aston-martin-valkyrie-amr-pro",
    },
  });

  return json(editedCar);
};

export const getCarBySlug = async (slug: string) => {
  const car = await prisma.car.findUnique({ where: { slug } });
  return car ? json<Car>(car) : null;
};
