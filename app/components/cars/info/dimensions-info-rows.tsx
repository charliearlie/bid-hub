import type { Dimensions } from "@prisma/client";
import CarInfoRow from "./car-info-row";

type Props = {
  dimensions: Dimensions;
};
// todo: We could maybe map the key to a value to make this usable across all info rows
export default function DimensionInfoRows({ dimensions }: Props) {
  const { height, length, weight, wheelBase, width } = dimensions;
  return (
    <ul>
      {weight && <CarInfoRow label="Curb weight" value={`${weight}kg`} />}
      {length && <CarInfoRow label="Length" value={`${length}cm`} />}
      {height && <CarInfoRow label="Height" value={`${height}cm`} />}
      {width && <CarInfoRow label="Width" value={`${width}cm`} />}
      {wheelBase && <CarInfoRow label="Wheelbase" value={`${wheelBase}cm`} />}
    </ul>
  );
}
