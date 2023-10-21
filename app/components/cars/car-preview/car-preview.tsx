import { Link } from "@remix-run/react";
import Card from "~/components/common/card/card";
import CardContent from "~/components/common/card/card-content";
import CardImage from "~/components/common/card/card-image";
import type { CarType as Car, CarPreviewType } from "~/util/types";

type CarPreviewProps = {
  car: CarPreviewType;
};

export default function CarPreview({ car }: CarPreviewProps) {
  const { manufacturerName, model, previewImage, slug, variation, year } = car;

  return (
    <Card>
      <CardImage
        to={`/cars/${slug}`}
        src={previewImage || "defaultImage"}
        alt={`${manufacturerName} ${model}`}
      />
      <CardContent>
        <div className="h-24">
          <Link to={`/cars/${slug}`} className="hover:opacity-80">
            <h3 className="block font-black leading-none">
              <span className="block text-3xl">{manufacturerName}</span>
              <span className="block text-xl">
                {model} {variation}
              </span>
            </h3>
          </Link>
        </div>
        <p className="font-semi-bold text-xl">{year}</p>
      </CardContent>
    </Card>
  );
}
