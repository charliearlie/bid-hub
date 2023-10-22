import { useFormAction, useNavigation } from "@remix-run/react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * If a condition fails, throw a new Error response
 */
export function invariantResponse(
  condition: any,
  message: string | (() => string),
  responseInit?: ResponseInit
): asserts condition {
  if (!condition) {
    throw new Response(
      typeof message === "function"
        ? message()
        : message || "An invariant failed. Provide a message to explain why",
      { status: 400, ...responseInit }
    );
  }
}

type UseIsSubmittingOptions = {
  formAction?: string;
  formMethod?: "DELETE" | "GET" | "PATCH" | "PUT" | "POST";
};
export function useIsSubmitting({
  formAction,
  formMethod = "POST",
}: UseIsSubmittingOptions) {
  const contextualFormAction = useFormAction();
  const navigation = useNavigation();

  return (
    navigation.state === "submitting" &&
    navigation.formAction === (formAction ?? contextualFormAction) &&
    navigation.formMethod === formMethod
  );
}
