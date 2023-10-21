import {
  redirect,
  type DataFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Button from "~/components/common/button";
import { getCarBySlug } from "~/services/cars.server";
import Card from "~/components/common/card/card";
import CardContent from "~/components/common/card/card-content";
import CardHeader from "~/components/common/card/card-header";
import CardSubHeader from "~/components/common/card/card-subheader";
import PowerTrainInfoRows from "~/components/cars/info/powertrain-info-rows";
import EngineInfoRows from "~/components/cars/info/engine-info-rows";
import BodyAndChassisInfoRows from "~/components/cars/info/body-and-chassis-info-rows";
import DimensionInfoRows from "~/components/cars/info/dimensions-info-rows";

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.carSlug, "Expected params.carSlug");

  try {
    return await getCarBySlug(params.carSlug);
  } catch (error) {
    return redirect("/cars");
  }
}

export default function CarSlugRoute() {
  const car = useLoaderData<typeof loader>();
  if (car) {
    const {
      bodyAndChassis,
      dimensions,
      model,
      variation,
      images,
      powertrain,
      topSpeed,
      zeroTo60,
      zeroTo100,
      manufacturerName,
    } = car;

    const image = images?.[0];
    return (
      <main className="">
        <img
          className=" h-72 w-full object-cover lg:h-[32rem]"
          src={image?.imageUrl || ""}
          alt={`${manufacturerName} ${model}`}
        />
        <div className="flex flex-col gap-8 p-4 md:flex-row md:p-12">
          <div className="w-full">
            <h1 className="text-2xl font-black md:text-4xl">
              {manufacturerName} {model} {variation}
            </h1>
            I could easily make the cards below tabs but they may vary in height
            which will cause a disgusting content shift
            <Card>
              <CardHeader>Key figures</CardHeader>
              <CardContent>
                <div className="px-2">
                  {zeroTo60 && <p>0 - 60 in {zeroTo60} seconds</p>}
                  {zeroTo100 && <p>0 - 60 in {zeroTo100} seconds</p>}
                  {topSpeed && <p>Top speed: {topSpeed}Mph</p>}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              {powertrain && (
                <Card>
                  <CardHeader>Powertrain</CardHeader>
                  <CardContent noPadding>
                    <PowerTrainInfoRows powertrain={powertrain} />
                    {powertrain.engine && (
                      <>
                        <CardSubHeader>Engine</CardSubHeader>
                        <EngineInfoRows engine={powertrain.engine} />
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
              {bodyAndChassis && (
                <Card>
                  <CardHeader>Body & chassis</CardHeader>
                  <CardContent noPadding>
                    <BodyAndChassisInfoRows bodyAndChassis={bodyAndChassis} />
                    {dimensions && (
                      <>
                        <CardSubHeader>Dimensions</CardSubHeader>
                        <DimensionInfoRows dimensions={dimensions} />
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            <Button variant="primary">Like</Button>
          </div>
        </div>
      </main>
    );
  }
}
