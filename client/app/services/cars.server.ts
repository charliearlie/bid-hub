import { prisma } from "./prisma.server";
import { json } from "@remix-run/node";
import { Car, Manufacturer } from "@prisma/client";
import { typedjson } from "remix-typedjson";

export async function getAllCars() {
  return typedjson({ cars: await prisma.car.findMany() });
}

export async function addManufacturer({
  name,
  country,
  discipline,
}: Manufacturer) {
  const newManufacturer = await prisma.manufacturer.create({
    data: {
      name,
      country,
      ...(discipline && { discipline }),
    },
  });

  return json(newManufacturer);
}

export async function addCar(car: Car) {
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
