import { Engine, Powertrain } from "@prisma/client";
import CarInfoRow from "./car-info-row";

type Props = {
  engine: Engine;
};
// todo: We could maybe map the key to a value to make this usable across all info rows
export default function EngineInfoRows({ engine }: Props) {
  const {
    configuration,
    cylinders,
    displacement,
    induction,
    layout,
    name,
    supplier,
  } = engine;
  return (
    <ul>
      {name && (
        <CarInfoRow
          label="Name"
          value={`${supplier || ""} ${displacement || ""} ${name}`}
        />
      )}
      {configuration && (
        <CarInfoRow label="Configuration" value={configuration} />
      )}
      {induction && <CarInfoRow label="Induction" value={induction} />}
      {cylinders && <CarInfoRow label="Cylinders" value={cylinders} />}
      {layout && <CarInfoRow label="Layout" value={layout} />}
    </ul>
  );
}
