import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Previews } from "~/components/cars";
import { getAllCars } from "~/services/cars.server";

export const meta = () => {
  return [{ title: "Brake Neck - Cars at break neck speed" }];
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

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <main>
      <img
        className="h-48 w-full object-cover md:h-96 lg:h-[32rem]"
        src="https://res.cloudinary.com/bidhub/image/upload/v1678720975/bidhub/Valkyrie-AMR-Pro_08_169.jpg"
        alt="Aston Martin Valkyrie"
      />
      <div>
        <h2 className="flex h-16 w-full items-center justify-center rounded bg-gray-900 text-center text-3xl font-black">
          Hottest hypercars
        </h2>
        <div className="mx-auto max-w-screen-2xl py-4 px-2 lg:px-4">
          <Previews cars={loaderData.cars} />
        </div>
      </div>
    </main>
  );
}
