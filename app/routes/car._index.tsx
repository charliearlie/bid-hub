import { ActionFunctionArgs, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import Button from "~/components/common/button";
import { addCar } from "~/services/cars.server";

export const action = async ({}: ActionFunctionArgs) => {
  // const formData = await request.formData();
  const newCar = await addCar({
    slug: "porsche-carrera-gt",
    model: "Carrera GT",
    variation: null,
    year: 2005,
    powertrain: {
      engine: {
        layout: null,
        displacement: "5.7 L",
        supplier: "Porsche",
        name: "Type 980",
        configuration: "V10",
        induction: "Naturally aspirated",
        cylinders: null,
      },
      electricPower: 0,
      horsepower: 605,
      transmission: "6-speed manual",
      battery: null,
      hybridDrivetrain: null,
      fullPowerOutput: 605,
      lbsOfTorque: 435,
      supplier: "Porsche",
    },
    bodyAndChassis: {
      bodyMaterial: "Carbon fiber",
      bodyStyle: "2-door roadster",
      brakes: "Carbon-ceramic",
      doorType: "Conventional",
      layout: "Rear mid-engine, rear-wheel-drive",
      steering: "Rack and pinion",
      suspension: {
        front: "Double wishbone",
        rear: "Double wishbone",
      },
      seats: 2,
      tyres: "Michelin Pilot Sport PS2",
    },
    dimensions: {
      wheelBase: 2730,
      height: 1160,
      width: 1920,
      length: 4600,
      weight: 1380,
    },
    topSpeed: 205,
    zeroTo60: 3.5,
    zeroTo100: 6.8,
    images: [
      {
        imageUrl:
          "https://res.cloudinary.com/bidhub/image/upload/v1679066661/brakeneck/gltypej9trwbui4jziwz.jpg",
        credit: "",
      },
    ],
    previewImage:
      "https://res.cloudinary.com/bidhub/image/upload/v1679066504/brakeneck/lsovv88btzifgdgdtdoq.jpg",
    manufacturerName: "Porsche",
    drivetrain: "Rear-wheel drive",
    infotainmentSystem: {
      touchscreenDisplay: false,
      speakers: 6,
      bluetoothConnectivity: false,
      appleCarplay: false,
      androidAuto: false,
    },
    safetyFeatures: {
      airbags: 4,
      antilockBrakes: true,
      tractionControl: true,
      electronicStabilityControl: false,
      backupCamera: false,
    },
    marketPrice: 750000,
    carType: "Supercar",
    codeNames: ["Type 980"],
    technologyPartner: null,
    production: {
      start: 2004,
      end: 2007,
      units: 1270,
    },
  });

  return json(newCar);
};

export default function CarRoute() {
  const actionData = useActionData<typeof action>();
  return (
    <main>
      <form method="post">
        <Button>Add manufacturers</Button>
      </form>
      {JSON.stringify(actionData)}
    </main>
  );
}
