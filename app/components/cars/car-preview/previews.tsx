import CarPreview from "../car-preview/car-preview";
import type { CarType as Car } from "~/util/types";

export default function Previews({ cars }: { cars: Car[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cars.map((car, idx) => (
        <li className="rounded" key={car.slug}>
          <CarPreview car={car} />
        </li>
      ))}
    </ul>
  );
}
