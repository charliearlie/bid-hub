import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllCars } from "~/services/cars.server";

export const loader: LoaderFunction = async ({ request }) => {
  return getAllCars();
};

export default function Index() {
  const loaderData = useLoaderData();

  return <div>{JSON.stringify(loaderData)}</div>;
}
