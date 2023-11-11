import { buildListingEndDateAndTime } from "~/util/utils";

// Just an example of a resource route
export const loader = () => {
  const date = buildListingEndDateAndTime("2024-08-01");

  return new Response(date?.toUTCString());
};
