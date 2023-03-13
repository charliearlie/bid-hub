import { LoaderArgs } from "@remix-run/node";
import { useTypedLoaderData } from "remix-typedjson";
import { Previews } from "~/components/cars";
import { getAllCars } from "~/services/cars.server";

export const loader = async ({ request }: LoaderArgs) => {
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
      <div className="px-4 py-4">
        <Previews cars={loaderData.cars} />
      </div>
    </main>
  );
}
