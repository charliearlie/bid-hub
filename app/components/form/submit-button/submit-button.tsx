import { useFormAction, useNavigation } from "@remix-run/react";
import React from "react";

import { Button, type ButtonProps } from "~/components/common/ui/button";
import Spinner from "~/components/spinner";

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

  const content = isPending ? (
    <span className="flex items-center justify-evenly text-center">
      <Spinner />
      {children}
    </span>
  ) : (
    children
  );
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

SubmitButton.displayName = "SubmitButton";
