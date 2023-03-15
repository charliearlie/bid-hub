import { useLoaderData } from "@remix-run/react";
import type { DataFunctionArgs, LoaderFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import Button from "~/components/common/button";
import { getCarBySlug } from "~/services/cars.server";
import type { Car } from "@prisma/client";

export const loader: LoaderFunction = async ({ params }: DataFunctionArgs) => {
  invariant(params.carSlug, "Expected params.carSlug");
  try {
    return await getCarBySlug(params.carSlug);
  } catch (error) {
    return redirect("/cars");
  }
};

export default function CarSlugRoute() {
  const car = useLoaderData<Car>();
  if (car) {
    const {
      model,
      variation,
      images,
      powertrain,
      previewImage,
      topSpeed,
      zeroTo60,
      manufacturerName,
    } = car;

    const image = images[0];
    return (
      <main className="">
        <img
          className="h-[32rem] w-full object-cover"
          src={image.imageUrl || ""}
          alt={`${manufacturerName} ${model}`}
        />
        <div className="flex flex-col gap-8 p-4 md:flex-row md:p-12">
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
