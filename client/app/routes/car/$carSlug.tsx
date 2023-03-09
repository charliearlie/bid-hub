import { useLoaderData } from "@remix-run/react";
import { DataFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import Button from "~/components/button";
import { getCarBySlug } from "~/services/cars.server";
import { Car } from "@prisma/client";

export const loader: LoaderFunction = async ({ params }: DataFunctionArgs) => {
  invariant(params.carSlug, "Expected params.carSlug");
  try {
    return await getCarBySlug(params.carSlug);
  } catch (error) {
    return redirect("/cars");
  }
};

export default function ItemRoute() {
  const car = useLoaderData<Car>();
  if (car) {
    const {
      model,
      variation,
      images,
      powertrain,
      topSpeed,
      zeroTo60,
      manufacturerName,
    } = car;

    return (
      <main className="p-4 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row">
          <img src="https://ih1.redbubble.net/image.1003426384.0291/st,small,507x507-pad,600x600,f8f8f8.jpg" />
          <div>
            <h1 className="text-2xl font-black md:text-4xl">
              {manufacturerName} {model}
            </h1>
            <h2 className="text-2xl font-black md:text-4xl">{variation}</h2>
            <p>0 - 60 in {zeroTo60} seconds</p>
            <Button variant="primary">Like</Button>
          </div>
        </div>
      </main>
    );
  }
}
