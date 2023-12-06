import {
  ClothingOptions,
  ElectricalOptions,
  FulfilmentOption,
} from "@prisma/client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/common/ui/accordion";

import { FulfilmentOptions } from "../fulfilment-options/fulfilment-options";
import { ProductDetails } from "../product-details/product-details";

type Props = {
  fulfilmentOptions: Pick<
    FulfilmentOption,
    "minDays" | "maxDays" | "method" | "price"
  >[];
  clothingOptions: Partial<ClothingOptions> | null;
  electricalOptions: ElectricalOptions | null;
};

export const ListingAdditionalDetailsSection = ({
  clothingOptions,
  electricalOptions,
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
            <AccordionTrigger>Product Details</AccordionTrigger>
            <AccordionContent>
              <ProductDetails
                options={{ ...clothingOptions, ...electricalOptions }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="fulfilmentOptions">
            <AccordionTrigger>Delivery options</AccordionTrigger>
            <AccordionContent>
              <FulfilmentOptions options={fulfilmentOptions} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="fulfilmentOptions">
            <AccordionTrigger>Warranty & Insurance</AccordionTrigger>
            <AccordionContent>
              This item doesn't have a warranty and if you want insurance then
              you need to pay us the big bucks
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
