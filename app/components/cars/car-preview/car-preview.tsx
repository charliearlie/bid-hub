import type { Car } from "@prisma/client";
import Card from "~/components/common/card/card";
import CardContent from "~/components/common/card/card-content";
import CardImage from "~/components/common/card/card-image";

type CarPreviewProps = {
  car: Car;
};

export default function CarPreview({ car }: CarPreviewProps) {
  const { manufacturerName, model, previewImage, slug, variation, year } = car;

  return (
    <Card>
      <CardImage
        to={`/car/${slug}`}
        src={previewImage || "defaultImage"}
        alt={`${manufacturerName} ${model}`}
      />
      <CardContent>
        <div className="h-24">
          <h3 className="text-3xl font-black leading-none">
            {manufacturerName}
          </h3>
          <p className="text-2xl font-semibold">
            {model} {variation}
          </p>
        </div>
        <p className="font-semi-bold text-xl">{year}</p>
      </CardContent>
    </Card>
  );
}
