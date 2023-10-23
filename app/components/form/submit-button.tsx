import React from "react";
import { Button, ButtonProps } from "../common/ui/button";
import Spinner from "../spinner";

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    status?: "error" | "idle" | "pending" | "success";
  }
>(({ className, status = "idle", children, ...props }, ref) => {
  const isPending = status === "pending";
  const content = isPending ? <Spinner /> : children;
  return (
    <Button className={className} ref={ref} disabled={isPending} {...props}>
      {content}
    </Button>
  );
});
