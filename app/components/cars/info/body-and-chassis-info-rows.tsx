import type { BodyAndChassis } from "@prisma/client";
import CarInfoRow from "./car-info-row";

type Props = {
  bodyAndChassis: BodyAndChassis;
};
// todo: We could maybe map the key to a value to make this usable across all info rows
export default function BodyAndChassisInfoRows({ bodyAndChassis }: Props) {
  const { bodyMaterial, brakes, doorType, layout, seats, steering, tyres } =
    bodyAndChassis;
  return (
    <ul>
      {layout && <CarInfoRow label="Layout" value={layout} />}
      {bodyMaterial && (
        <CarInfoRow label="Body material" value={bodyMaterial} />
      )}
      {doorType && <CarInfoRow label="Doors" value={doorType} />}
      {seats && <CarInfoRow label="Seats" value={seats} />}
      {brakes && <CarInfoRow label="Brakes" value={brakes} />}
      {steering && <CarInfoRow label="Steering" value={steering} />}
      {tyres && <CarInfoRow label="Tyres" value={tyres} />}
    </ul>
  );
}
