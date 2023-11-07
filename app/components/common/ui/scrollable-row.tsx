import { PropsWithChildren } from "react";

export const ScrollableRow = ({ children }: PropsWithChildren) => {
  return (
    <ul className="relative z-0 grid snap-x snap-mandatory auto-cols-[16rem] grid-flow-col gap-2 overflow-x-auto pt-2">
      {children}
    </ul>
  );
};
