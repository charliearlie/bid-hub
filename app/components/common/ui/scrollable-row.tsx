import { PropsWithChildren } from "react";

export const ScrollableRow = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative z-0 grid snap-x auto-cols-[16rem] grid-flow-col gap-2 overflow-x-auto pt-2 lg:grid-cols-6">
      {children}
    </div>
  );
};
