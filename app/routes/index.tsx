import { useTypedLoaderData } from "remix-typedjson";
import { Previews } from "~/components/cars";
import { getAllCars } from "~/services/cars.server";

export const meta = () => {
  return [{ title: "Brake Neck - Cars at break neck speed" }];
};

export const loader = async () => {
  return getAllCars();
};

export default function Index() {
  const loaderData = useTypedLoaderData<typeof loader>();
  console.log(loaderData.cars);

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
