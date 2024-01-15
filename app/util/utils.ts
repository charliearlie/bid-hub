import type { SerializeFrom } from "@remix-run/node";
import type { Navigation } from "@remix-run/react";
import { useRouteLoaderData } from "@remix-run/react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

import type { RouteId } from "~/types/route-id";

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

export function useRouteLoaderDataTyped<T = unknown>(routeId: RouteId) {
  return useRouteLoaderData(routeId) as SerializeFrom<T>;
}

export function camelCaseToHumanReadable(str: string) {
  const withSpaces = str.replace(/([a-z])([A-Z0-9])/g, "$1 $2");

  const titleCase = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);

  return titleCase;
}
