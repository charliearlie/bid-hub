import { Car } from "@prisma/client";
import { Link } from "@remix-run/react";

type CarPreviewProps = {
  car: Car;
};

export default function CarPreview({ car }: CarPreviewProps) {
  const { manufacturerName, model, slug } = car;

  return (
    <Link to={`/car/${slug}`} className="flex gap-4 py-4 px-4">
      <div className="h-24 w-24 flex-none">
        <img src="https://ih1.redbubble.net/image.1003426384.0291/st,small,507x507-pad,600x600,f8f8f8.jpg" />
      </div>
      <div className="flex-auto">
        <h3 className="h-9 overflow-hidden font-black leading-none">
          {manufacturerName}
        </h3>
        <p className="text-xs font-semibold">{model}</p>
      </div>
    </Link>
  );
}
