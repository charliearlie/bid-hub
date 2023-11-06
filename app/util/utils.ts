import { Navigation, useFormAction, useNavigation } from "@remix-run/react";
import { type ClassValue, clsx } from "clsx";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

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

export function generateSlug(listingTitle: string) {
  const uuid = uuidv4();
  return listingTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .concat(`-${uuid}`);
}

export function buildListingEndDateAndTime(endDateString?: string) {
  if (!endDateString) {
    return;
  }

  const endDate = new Date(endDateString);
  const currentDate = new Date();
  endDate.setHours(currentDate.getHours() + 1);
  endDate.setMinutes(currentDate.getMinutes());
  endDate.setSeconds(currentDate.getSeconds());

  return endDate;
}
