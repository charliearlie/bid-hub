import { Navigation, useFormAction, useNavigation } from "@remix-run/react";
import { type ClassValue, clsx } from "clsx";
import { useEffect } from "react";
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

export function useFocusInvalidForm(
  formElement: HTMLFormElement | null,
  hasErrors: boolean
) {
  useEffect(() => {
    if (!hasErrors) {
      return;
    }

    if (formElement) {
      if (formElement.matches('[aria-invalid="true"]')) {
        formElement.focus();
        return;
      }

      const invalidElement = formElement.querySelector('[aria-invalid="true"]');

      if (invalidElement instanceof HTMLElement) {
        invalidElement.focus();
      }
    }
  }, [hasErrors, formElement]);
}

export function isFormInPendingState(
  navigation: Navigation,
  formAction: string
) {
  return (
    navigation.state !== "idle" &&
    navigation.formAction === formAction &&
    navigation.formMethod === "POST"
  );
}
