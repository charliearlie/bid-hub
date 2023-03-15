import { PropsWithChildren } from "react";

export default function CardContent({ children }: PropsWithChildren) {
  return <div className="py-2 text-center">{children}</div>;
}
