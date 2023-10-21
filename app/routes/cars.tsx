import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Previews from "~/components/cars/car-preview/previews";
import { getAllCars } from "~/services/cars.server";

export const meta = () => {
  return [{ title: "Latest cars" }, { name: "description", content: "" }];
};

export const loader = async () => {
  const cars = await getAllCars();

  if (!cars) {
    throw new Response("Cars failed to load", { status: 500 });
  }

  const carPreviewData = cars.map((car) => {
    const { manufacturerName, model, previewImage, slug, variation, year } =
      car;
    return { manufacturerName, model, previewImage, slug, variation, year };
  });
  return json({ cars: carPreviewData });
};

export default function ItemsIndexRoute() {
  const { cars } = useLoaderData<typeof loader>();
  return <Previews cars={cars} />;
}
