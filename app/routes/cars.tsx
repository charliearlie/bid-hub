import { useTypedLoaderData } from "remix-typedjson";
import Previews from "~/components/cars/car-preview/previews";
import { getAllCars } from "~/services/cars.server";

export const meta = () => {
  return [{ title: "Latest cars" }, { name: "description", content: "" }];
};

export const loader = async () => {
  return await getAllCars();
};

export default function ItemsIndexRoute() {
  const { cars } = useTypedLoaderData<typeof loader>();
  return <Previews cars={cars} />;
}
