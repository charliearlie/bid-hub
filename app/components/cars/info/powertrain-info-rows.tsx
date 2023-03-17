import { Powertrain } from "@prisma/client";
import CarInfoRow from "./car-info-row";

type Props = {
  powertrain: Powertrain;
};
// todo: We could maybe map the key to a value to make this usable across all info rows
export default function PowerTrainInfoRows({ powertrain }: Props) {
  const {
    battery,
    electricPower,
    fullPowerOutput,
    horsepower,
    hybridDrivetrain,
    lbsOfTorque,
    transmission,
  } = powertrain;
  return (
    <ul>
      {horsepower && (
        <CarInfoRow label="Horsepower" value={`${horsepower}hp`} />
      )}
      {transmission && <CarInfoRow label="Transmission" value={transmission} />}
      {hybridDrivetrain && (
        <CarInfoRow label="Hybrid drive train" value={hybridDrivetrain} />
      )}
      {battery && <CarInfoRow label="Battery" value={`${battery}W`} />}
      {electricPower ? (
        <CarInfoRow label="Electric power" value={electricPower} />
      ) : null}
      {fullPowerOutput && (
        <CarInfoRow label="Full power output" value={`${fullPowerOutput}hp`} />
      )}
      {lbsOfTorque && <CarInfoRow label="Torque" value={lbsOfTorque} />}
    </ul>
  );
}
