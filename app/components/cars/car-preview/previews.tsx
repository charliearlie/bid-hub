import { Car } from "@prisma/client";
import Divider from "../../divider";
import CarPreview from "../car-preview/car-preview";

export default function Previews({ cars }: { cars: Car[] }) {
  return (
    <ul className="grid grid-cols-1 lg:grid-cols-3">
      {cars.map((car) => (
        <li key={car.slug}>
          <CarPreview car={car} />
          <Divider />
        </li>
      ))}
    </ul>
  );
}
