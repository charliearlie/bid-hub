import { Car } from "@prisma/client";
import { LoaderArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import Previews from "~/components/cars/car-preview/previews";
import { getAllCars } from "~/services/cars.server";

export const meta: MetaFunction = () => {
  return {
    title: "Latest cars",
    description: "",
  };
};

type LoaderData = {
  cars: Car[];
};

export const loader = async () => {
  return await getAllCars();
};

export default function ItemsIndexRoute() {
  const { cars } = useTypedLoaderData<typeof loader>();
  return <Previews cars={cars} />;
}
