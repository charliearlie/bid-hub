import { Link } from "@remix-run/react";
import type { ImgHTMLAttributes } from "react";

type CardImageProps = {
  to: string;
};

type Props = ImgHTMLAttributes<HTMLImageElement> & CardImageProps;

export default function CardImage({ to, ...imageProps }: Props) {
  return (
    <Link to={to} className="flex w-full cursor-pointer rounded">
      <img
        className="h-60 w-full rounded-t-lg object-cover"
        loading="lazy"
        height="15rem"
        width="100%"
        {...imageProps}
      />
    </Link>
  );
}
