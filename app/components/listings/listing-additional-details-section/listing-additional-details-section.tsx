import { FulfilmentOption } from "@prisma/client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/common/ui/accordion";

import { FulfilmentOptions } from "../fulfilment-options/fulfilment-options";

type Props = {
  fulfilmentOptions: Pick<
    FulfilmentOption,
    "minDays" | "maxDays" | "method" | "price"
  >[];
};

export const ListingAdditionalDetailsSection = ({
  fulfilmentOptions,
}: Props) => {
  return (
    <section aria-labelledby="details-heading" className="mt-12">
      <h2 id="details-heading" className="sr-only">
        Additional details
      </h2>

      <div className="divide-y divide-gray-200 border-t">
        <Accordion type="single" collapsible>
          <AccordionItem value="fulfilmentOptions">
            <AccordionTrigger>Delivery options</AccordionTrigger>
            <AccordionContent>
              <FulfilmentOptions options={fulfilmentOptions} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {[1, 2, 3, 4].map((num) => (
          <Accordion key={num} type="single" collapsible>
            <AccordionItem value={String(num)}>
              <AccordionTrigger>Features</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};
