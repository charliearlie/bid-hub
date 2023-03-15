import { ImgHTMLAttributes } from "react";
import { Link } from "@remix-run/react";

type CardImageProps = {
  to: string;
};

type Props = ImgHTMLAttributes<HTMLImageElement> & CardImageProps;

export default function CardImage({ to, ...imageProps }: Props) {
  return (
    <Link to={to} className="flex w-full cursor-pointer rounded">
      <img {...imageProps} />
    </Link>
  );
}
