import React from "react";
import { Button, ButtonProps } from "../common/ui/button";
import Spinner from "../spinner";
import { useFormAction, useNavigation } from "@remix-run/react";
import { isFormInPendingState } from "~/util/utils";

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    status?: "error" | "idle" | "pending" | "success";
  }
>(({ className, status = "idle", children, ...props }, ref) => {
  const navigation = useNavigation();
  const formAction = useFormAction();
  const isPending = isFormInPendingState(navigation, formAction);

  const content = isPending ? <Spinner /> : children;
  return (
    <Button
      className={className}
      ref={ref}
      disabled={isPending}
      type="submit"
      {...props}
    >
      {content}
    </Button>
  );
});
