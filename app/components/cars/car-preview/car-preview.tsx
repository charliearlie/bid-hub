import { Car } from "@prisma/client";
import { Link } from "@remix-run/react";

type CarPreviewProps = {
  car: Car;
};

export default function CarPreview({ car }: CarPreviewProps) {
  const { manufacturerName, model, previewImage, slug, variation, year } = car;

  console.log("previewImage", previewImage);

  return (
    <Link
      to={`/car/${slug}`}
      aria-label={`View ${manufacturerName} ${model}`}
      className="flex w-full cursor-pointer flex-col items-center gap-2 rounded outline outline-2 outline-gray-800 hover:opacity-70 focus:outline-4 focus:outline-blue-400"
    >
      <img
        className="h-60 w-full object-cover"
        loading="lazy"
        src={previewImage || "defaultImage"}
        alt={`${manufacturerName} ${model}`}
      />
      <div className="py-2 text-center">
        <h3 className="text-3xl font-black leading-none">{manufacturerName}</h3>
        <p className="text-2xl font-semibold">
          {model} {variation}
        </p>
        <p className="font-semi-bold text-xl">{year}</p>
      </div>
    </Link>
  );
}
