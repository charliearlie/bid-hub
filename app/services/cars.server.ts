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
      model: "R8",
      variation: "Spyder",
      year: 2022,
      powertrain: {
        engine: {
          layout: null,
          displacement: "5.2 L",
          supplier: "Audi",
          name: null,
          configuration: "V10",
          induction: "Naturally aspirated",
          cylinders: null,
        },
        electricPower: 0,
        horsepower: 602,
        transmission: "7-speed dual-clutch",
        battery: null,
        hybridDrivetrain: null,
        fullPowerOutput: 602,
        lbsOfTorque: 413,
        supplier: "Audi",
      },
      bodyAndChassis: {
        bodyMaterial: "Carbon fiber reinforced plastic (CFRP)",
        bodyStyle: "2-door coupe",
        brakes: "Carbon-ceramic",
        doorType: "Standard",
        layout: "Mid-engine, all-wheel-drive",
        steering: "Electric power-assist rack-and-pinion",
        suspension: {
          front: "Double wishbone",
          rear: "Double wishbone",
        },
        seats: 2,
        tyres: "Pirelli P Zero",
      },
      dimensions: {
        wheelBase: 2650,
        height: 1240,
        width: 1940,
        length: 4420,
        weight: 3593,
      },
      topSpeed: 201,
      zeroTo60: 3.2,
      zeroTo100: 6.9,
      images: [
        {
          imageUrl:
            "https://res.cloudinary.com/bidhub/image/upload/v1679062996/brakeneck/lzllhneyarm5cmmwseyy.jpg",
          credit: "",
        },
      ],
      previewImage:
        "https://res.cloudinary.com/bidhub/image/upload/v1678957669/brakeneck/ezerjl45rvelrptgzfk4.jpg",
      manufacturerName: "Audi",
      drivetrain: "All-wheel drive",
      infotainmentSystem: {
        touchscreenDisplay: true,
        speakers: 13,
        bluetoothConnectivity: true,
        appleCarplay: true,
        androidAuto: true,
      },
      safetyFeatures: {
        airbags: 6,
        antilockBrakes: true,
        tractionControl: true,
        electronicStabilityControl: true,
        backupCamera: true,
      },
      marketPrice: 142700,
      carType: "Supercar",
      codeNames: ["Type 4S"],
      technologyPartner: null,
      production: {
        start: 2015,
        end: null,
        units: null,
      },
    },
  });

  return json(editedCar);
};

export const getCarBySlug = async (slug: string) => {
  const car = await prisma.car.findUnique({ where: { slug } });
  return typedjson(car);
};
