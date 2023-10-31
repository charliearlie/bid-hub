import type { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      {children}
    </div>
  );
}
