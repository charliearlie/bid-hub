import type { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col rounded bg-gray-800 shadow shadow-gray-900 outline outline-2 outline-gray-800 hover:opacity-70 focus:outline-4 focus:outline-blue-400">
      {children}
    </div>
  );
}
