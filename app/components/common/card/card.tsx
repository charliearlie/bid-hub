import type { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <div className="my-2 flex flex-col rounded-lg bg-gray-800 shadow shadow-gray-900 focus:outline-4 focus:outline-blue-400">
      {children}
    </div>
  );
}
