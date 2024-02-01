import React from "react";

import { cn } from "~/util/utils";

export const StandardLayout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <main
      className={cn("container mx-auto max-w-screen-xl p-4 md:px-8", className)}
      ref={ref}
      {...props}
    >
      {children}
    </main>
  );
});
