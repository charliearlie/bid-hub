import React from "react";

import { cn } from "~/util/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  console.log("className", className);
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});
